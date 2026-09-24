import { db } from '../database/db.ts';
import { DataImportRecord } from '../database/types.ts';

export class DataIngestionService {
  public static getTemplate(datasetType: string): { filename: string; mime: string; content: string } {
    switch (datasetType.toLowerCase()) {
      case 'student performance':
      case 'student_performance':
        return {
          filename: 'template_student_performance.csv',
          mime: 'text/csv',
          content: 'student_id,first_name,last_name,department,semester,gpa,attendance_rate\nNPU-2024-1001,Elena,Rostova,Computer Science,3,3.78,92.5\nNPU-2024-1002,Marcus,Sterling,Electrical Engineering,3,2.84,74.0',
        };
      case 'assessment results':
      case 'assessment_results':
        return {
          filename: 'template_assessment_results.csv',
          mime: 'text/csv',
          content: 'assessment_id,student_id,course_code,question_number,concept_code,score_obtained,max_marks\nASM-M202-01,NPU-2024-1001,MATH202,1,MTH-ALG,8.5,10.0\nASM-M202-01,NPU-2024-1001,MATH202,2,MTH-INT,6.0,15.0',
        };
      case 'curriculum':
        return {
          filename: 'template_curriculum.csv',
          mime: 'text/csv',
          content: 'course_code,course_name,department,semester,credits,prerequisites,core_concepts\nCS201,Data Structures,Computer Science,3,4,CS101,"Arrays,Trees,Graphs"\nMATH202,Engineering Mathematics II,Electrical Engineering,3,4,MATH101,"Integration,Differential Equations"',
        };
      case 'attendance':
        return {
          filename: 'template_attendance.csv',
          mime: 'text/csv',
          content: 'student_id,course_code,session_date,attendance_status,session_type\nNPU-2024-1001,MATH202,2026-03-10,PRESENT,Lecture\nNPU-2024-1002,MATH202,2026-03-10,ABSENT,Lecture',
        };
      case 'course data':
      case 'course_data':
      default:
        return {
          filename: 'template_course_data.csv',
          mime: 'text/csv',
          content: 'course_code,course_name,instructor,enrolled_count,department,syllabus_url\nCS305,Operating Systems,Prof. Ronald Chen,240,Computer Science,https://syllabus.npu.edu/cs305',
        };
    }
  }

  public static processUpload(params: {
    datasetType: 'Student Performance' | 'Assessment Results' | 'Curriculum' | 'Attendance' | 'Course Data';
    fileName: string;
    fileContent: string;
    uploadedBy: string;
  }): { success: boolean; record: DataImportRecord; message: string; errors?: string[] } {
    const lines = params.fileContent.trim().split('\n');
    if (lines.length < 2) {
      return {
        success: false,
        record: {
          id: `imp-${Date.now()}`,
          datasetType: params.datasetType,
          fileName: params.fileName,
          rowsDetected: 0,
          columnsDetected: 0,
          recordsImported: 0,
          validationErrorsCount: 1,
          validationErrors: ['File contains insufficient data or missing headers.'],
          uploadedBy: params.uploadedBy,
          uploadedAt: new Date().toISOString(),
          status: 'Failed',
        },
        message: 'Upload validation failed: Header or records missing.',
        errors: ['File contains zero data rows or empty content.'],
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rowCount = lines.length - 1;
    const errors: string[] = [];

    // Dataset-specific header validations
    if (params.datasetType === 'Student Performance') {
      if (!headers.includes('student_id') || !headers.includes('gpa')) {
        errors.push('Missing mandatory columns: student_id, gpa');
      }
    } else if (params.datasetType === 'Assessment Results') {
      if (!headers.includes('assessment_id') || !headers.includes('student_id') || !headers.includes('score_obtained')) {
        errors.push('Missing mandatory columns: assessment_id, student_id, score_obtained');
      }
    } else if (params.datasetType === 'Curriculum') {
      if (!headers.includes('course_code') || !headers.includes('course_name')) {
        errors.push('Missing mandatory columns: course_code, course_name');
      }
    }

    // Sample row validation
    if (errors.length === 0) {
      for (let i = 1; i <= Math.min(10, rowCount); i++) {
        const cols = lines[i].split(',');
        if (cols.length !== headers.length) {
          errors.push(`Row ${i} column count (${cols.length}) does not match header count (${headers.length}).`);
          break;
        }
      }
    }

    if (errors.length > 0) {
      const failedRecord: DataImportRecord = {
        id: `imp-${Date.now()}`,
        datasetType: params.datasetType,
        fileName: params.fileName,
        rowsDetected: rowCount,
        columnsDetected: headers.length,
        recordsImported: 0,
        validationErrorsCount: errors.length,
        validationErrors: errors,
        uploadedBy: params.uploadedBy,
        uploadedAt: new Date().toISOString(),
        status: 'Failed',
      };
      db.imports.unshift(failedRecord);
      db.logAudit(params.uploadedBy, 'IMPORT_FAILED', params.fileName, errors.join('; '));
      return {
        success: false,
        record: failedRecord,
        message: `Validation failed with ${errors.length} errors.`,
        errors,
      };
    }

    const importedRecord: DataImportRecord = {
      id: `imp-${Date.now()}`,
      datasetType: params.datasetType,
      fileName: params.fileName,
      rowsDetected: rowCount,
      columnsDetected: headers.length,
      recordsImported: rowCount,
      validationErrorsCount: 0,
      uploadedBy: params.uploadedBy,
      uploadedAt: new Date().toISOString(),
      status: 'Completed',
    };

    db.imports.unshift(importedRecord);
    db.logAudit(
      params.uploadedBy,
      'DATA_IMPORTED',
      params.fileName,
      `Successfully ingested ${rowCount} rows for ${params.datasetType}.`
    );

    return {
      success: true,
      record: importedRecord,
      message: `Successfully validated and imported ${rowCount} records.`,
    };
  }
}
