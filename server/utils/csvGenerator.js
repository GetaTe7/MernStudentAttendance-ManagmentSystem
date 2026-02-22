const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

/**
 * Generates an attendance report in CSV format
 * @param {Array} records - Attendance records
 * @param {Object} metadata - Metadata for the report
 * @returns {Promise<string>} - Path to the generated CSV file
 */
const generateAttendanceCSV = async (records, metadata) => {
    const filename = `Report_${metadata.courseCode}_${Date.now()}.csv`;
    const reportsDir = path.join(__dirname, '../reports');

    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }

    const filePath = path.join(reportsDir, filename);

    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'studentName', title: 'STUDENT NAME' },
            { id: 'studentId', title: 'STUDENT ID' },
            { id: 'date', title: 'DATE' },
            { id: 'status', title: 'STATUS' },
            { id: 'remarks', title: 'REMARKS' }
        ]
    });

    const data = records.map(record => ({
        studentName: record.student.name,
        studentId: record.student.studentId || 'N/A',
        date: new Date(record.date).toLocaleDateString(),
        status: record.status.toUpperCase(),
        remarks: record.remarks || ''
    }));

    await csvWriter.writeRecords(data);
    return filePath;
};

module.exports = { generateAttendanceCSV };
