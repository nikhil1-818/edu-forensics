import { db } from '../database/db.ts';
import { RiskForecastData } from '../database/types.ts';

export class RiskForecastEngine {
  public static getForecast(params?: {
    courseId?: string;
    department?: string;
    horizon?: string;
  }): RiskForecastData {
    const horizon = params?.horizon || 'Next Assessment (Week 8)';
    const currentRisk = 42;
    const forecastRisk = 68;

    const timeline = [
      { period: 'Week 1', historical: 22, projected: 22, lowerBound: 20, upperBound: 24 },
      { period: 'Week 2', historical: 26, projected: 26, lowerBound: 23, upperBound: 29 },
      { period: 'Week 3', historical: 31, projected: 31, lowerBound: 27, upperBound: 34 },
      { period: 'Week 4', historical: 34, projected: 34, lowerBound: 30, upperBound: 38 },
      { period: 'Week 5', historical: 39, projected: 39, lowerBound: 35, upperBound: 43 },
      { period: 'Week 6 (Midterm)', historical: 42, projected: 42, lowerBound: 38, upperBound: 46 },
      { period: 'Week 7 (Proj)', projected: 51, lowerBound: 45, upperBound: 56 },
      { period: 'Week 8 (Exam Proj)', projected: 68, lowerBound: 61, upperBound: 75 },
      { period: 'Week 10 (Final Proj)', projected: 74, lowerBound: 66, upperBound: 82 },
    ];

    const contributingFactors = [
      {
        rank: 1,
        factor: 'Prerequisite Mastery Decay',
        impactPercentage: 42.5,
        direction: 'negative' as const,
        description:
          'A 28.4% decline in prerequisite mastery across foundational integration and memory pointers is the single largest driver of downstream risk propagation.',
      },
      {
        rank: 2,
        factor: 'Assessment Difficulty Variance',
        impactPercentage: 27.8,
        direction: 'negative' as const,
        description:
          'Upcoming examinations feature heavily weighted multi-step synthesis questions with high discrimination indices (>0.85).',
      },
      {
        rank: 3,
        factor: 'Assignment Submission Drop-off',
        impactPercentage: 18.2,
        direction: 'negative' as const,
        description:
          'Weekly lab and problem set completion rates have declined by 19% between Week 4 and Week 6.',
      },
      {
        rank: 4,
        factor: 'Lecture & Recitation Attendance Signal',
        impactPercentage: 11.5,
        direction: 'negative' as const,
        description:
          'Recitation attendance dropped below the 75% threshold in sections encountering multivariable calculus topics.',
      },
    ];

    const affectedCourses = [
      {
        code: 'MATH202',
        name: 'Engineering Mathematics II',
        currentRisk: 84,
        forecastRisk: 91,
        propagationRisk: 'High' as const,
      },
      {
        code: 'CS305',
        name: 'Operating Systems',
        currentRisk: 78,
        forecastRisk: 86,
        propagationRisk: 'High' as const,
      },
      {
        code: 'CS401',
        name: 'Machine Learning',
        currentRisk: 72,
        forecastRisk: 82,
        propagationRisk: 'High' as const,
      },
      {
        code: 'CS201',
        name: 'Data Structures',
        currentRisk: 54,
        forecastRisk: 58,
        propagationRisk: 'Medium' as const,
      },
      {
        code: 'CS308',
        name: 'Computer Networks',
        currentRisk: 46,
        forecastRisk: 51,
        propagationRisk: 'Medium' as const,
      },
    ];

    const affectedConcepts = [
      {
        name: 'Differential Equations',
        course: 'MATH202',
        riskScore: 92,
        downstreamImpactCount: 260,
      },
      {
        name: 'Threads & Synchronization',
        course: 'CS305',
        riskScore: 89,
        downstreamImpactCount: 162,
      },
      {
        name: 'Integration Techniques',
        course: 'MATH202',
        riskScore: 88,
        downstreamImpactCount: 235,
      },
      {
        name: 'Regression & Optimization',
        course: 'CS401',
        riskScore: 84,
        downstreamImpactCount: 145,
      },
      {
        name: 'Graphs & Traversals',
        course: 'CS201',
        riskScore: 76,
        downstreamImpactCount: 158,
      },
    ];

    const propagationSummary =
      'Gradient-boosted temporal survival analysis indicates that unaddressed prerequisite choke points in Semester 3 (Integration and Arrays/Pointers) propagate non-linearly, elevating Semester 5 and 7 course failure risks by +26 percentage points if left unmitigated.';

    return {
      currentRisk,
      forecastRisk,
      horizon,
      trend: 'up',
      timeline,
      contributingFactors,
      affectedCourses,
      affectedConcepts,
      propagationSummary,
    };
  }
}
