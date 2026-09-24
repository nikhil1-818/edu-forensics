import { db } from '../database/db.ts';
import { DigitalTwinGraph, DigitalTwinNode, DigitalTwinEdge, RiskLevel } from '../database/types.ts';

export class DigitalTwinService {
  public static getGraph(params?: {
    courseId?: string;
    semester?: number;
    riskOverlay?: boolean;
    masteryOverlay?: boolean;
  }): DigitalTwinGraph {
    const nodes: DigitalTwinNode[] = [];
    const edges: DigitalTwinEdge[] = [];

    // Base courses layout coordinates
    const courses = db.courses;
    const concepts = db.concepts;

    // Course Nodes
    courses.forEach((c, idx) => {
      if (params?.semester && c.semester !== Number(params.semester)) return;
      if (params?.courseId && c.id !== params.courseId && params.courseId !== 'all') return;

      const col = c.semester;
      const row = idx % 3;
      nodes.push({
        id: `node-c-${c.id}`,
        label: `${c.code}: ${c.name}`,
        type: 'Course',
        courseId: c.id,
        courseCode: c.code,
        courseName: c.name,
        semester: c.semester,
        mastery: 100 - c.failureRate,
        riskScore: c.riskScore,
        riskLevel: c.riskLevel,
        affectedStudents: c.enrolledStudents,
        prerequisitesCount: c.prerequisites.length,
        dependenciesCount: courses.filter(other => other.prerequisites.includes(c.code)).length,
        x: 120 + (col - 1) * 220,
        y: 80 + row * 160,
      });
    });

    // Concept Nodes
    concepts.forEach((concept, idx) => {
      const parentCourse = courses.find(c => c.id === concept.courseId);
      if (params?.courseId && params.courseId !== 'all' && concept.courseId !== params.courseId) {
        // Only skip if not upstream/downstream relevant
      }

      const col = parentCourse ? parentCourse.semester : 2;
      const rowOffset = (idx % 4) * 85 + 40;

      nodes.push({
        id: `node-concept-${concept.id}`,
        label: concept.name,
        type: 'Concept',
        courseId: concept.courseId,
        courseCode: concept.courseCode,
        courseName: concept.courseName,
        semester: col,
        mastery: concept.masteryRate,
        riskScore: concept.riskScore,
        riskLevel: concept.riskLevel,
        affectedStudents: concept.affectedStudents,
        prerequisitesCount: concept.prerequisiteIds.length,
        dependenciesCount: concept.downstreamIds.length,
        x: 60 + (col - 1) * 240 + (idx % 2 === 0 ? 0 : 40),
        y: 260 + rowOffset,
      });

      // CONTAINS edge from Course to Concept
      if (parentCourse) {
        edges.push({
          id: `edge-contains-${parentCourse.id}-${concept.id}`,
          source: `node-c-${parentCourse.id}`,
          target: `node-concept-${concept.id}`,
          type: 'CONTAINS',
          riskPropagationWeight: 0.5,
        });
      }

      // DEPENDS_ON edges between concepts
      concept.downstreamIds.forEach(downstreamId => {
        edges.push({
          id: `edge-dep-${concept.id}-${downstreamId}`,
          source: `node-concept-${concept.id}`,
          target: `node-concept-${downstreamId}`,
          type: 'DEPENDS_ON',
          riskPropagationWeight: concept.riskScore / 100,
        });
      });
    });

    // Course level REQUIRES edges
    courses.forEach(c => {
      c.prerequisites.forEach(prereqCode => {
        const prereqCourse = courses.find(pc => pc.code === prereqCode);
        if (prereqCourse) {
          edges.push({
            id: `edge-req-${prereqCourse.id}-${c.id}`,
            source: `node-c-${prereqCourse.id}`,
            target: `node-c-${c.id}`,
            type: 'REQUIRES',
            riskPropagationWeight: prereqCourse.riskScore / 100,
          });
        }
      });
    });

    const totalConcepts = concepts.length;
    const avgMastery = Math.round(concepts.reduce((a, b) => a + b.masteryRate, 0) / totalConcepts);
    const criticalBottlenecks = concepts.filter(c => c.riskLevel === 'HIGH' && c.downstreamIds.length > 0).length;

    return {
      nodes,
      edges,
      stats: {
        totalCourses: courses.length,
        totalUnits: 18,
        totalConcepts,
        criticalBottlenecks,
        averageCurriculumMastery: avgMastery,
      },
    };
  }

  public static trace(nodeId: string, direction: 'upstream' | 'downstream'): {
    activeNodeId: string;
    pathNodeIds: string[];
    affectedDependenciesCount: number;
    explanation: string;
  } {
    const rawId = nodeId.replace(/^node-(c|concept)-/, '');
    const concept = db.concepts.find(c => c.id === rawId || `node-concept-${c.id}` === nodeId);

    if (!concept) {
      // Return default trace
      return {
        activeNodeId: nodeId,
        pathNodeIds: [nodeId],
        affectedDependenciesCount: 1,
        explanation: 'Selected node is an isolated structural module.',
      };
    }

    if (direction === 'upstream') {
      const path = [nodeId];
      concept.prerequisiteIds.forEach(pId => {
        path.push(`node-concept-${pId}`);
        const parent = db.concepts.find(c => c.id === pId);
        if (parent) {
          parent.prerequisiteIds.forEach(gpId => path.push(`node-concept-${gpId}`));
        }
      });
      return {
        activeNodeId: nodeId,
        pathNodeIds: Array.from(new Set(path)),
        affectedDependenciesCount: path.length - 1,
        explanation: `Tracing upstream reveals ${path.length - 1} foundational concepts that feed directly into ${concept.name}. Any weakness in these roots cascades downstream.`,
      };
    } else {
      const path = [nodeId];
      concept.downstreamIds.forEach(dId => {
        path.push(`node-concept-${dId}`);
        const child = db.concepts.find(c => c.id === dId);
        if (child) {
          child.downstreamIds.forEach(gcId => path.push(`node-concept-${gcId}`));
        }
      });
      return {
        activeNodeId: nodeId,
        pathNodeIds: Array.from(new Set(path)),
        affectedDependenciesCount: path.length - 1,
        explanation: `Tracing downstream indicates that instability in ${concept.name} directly impacts ${path.length - 1} subsequent concepts and ${concept.affectedStudents} enrolled students.`,
      };
    }
  }
}
