const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates an attendance report in PDF format
 * @param {Array} records - Attendance records
 * @param {Object} metadata - Metadata for the report (Course name, Lecturer, Date range)
 * @returns {Promise<string>} - Path to the generated PDF file
 */
const generateAttendancePDF = (records, metadata) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const filename = `Report_${metadata.courseCode}_${Date.now()}.pdf`;
            const reportsDir = path.join(__dirname, '../reports');

            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir);
            }

            const filePath = path.join(reportsDir, filename);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc
                .fontSize(20)
                .text('Attendance Report', { align: 'center' })
                .moveDown();

            doc
                .fontSize(12)
                .text(`Course: ${metadata.courseName} (${metadata.courseCode})`)
                .text(`Lecturer: ${metadata.lecturerName}`)
                .text(`Date: ${new Date().toLocaleDateString()}`)
                .moveDown();

            // Table Header
            const tableTop = 200;
            doc
                .fontSize(10)
                .text('Student Name', 50, tableTop)
                .text('Student ID', 200, tableTop)
                .text('Date', 300, tableTop)
                .text('Status', 450, tableTop);

            doc
                .moveTo(50, tableTop + 15)
                .lineTo(550, tableTop + 15)
                .stroke();

            // Table Rows
            let y = tableTop + 30;
            records.forEach((record) => {
                doc
                    .text(record.student.name, 50, y)
                    .text(record.student.studentId || 'N/A', 200, y)
                    .text(new Date(record.date).toLocaleDateString(), 300, y)
                    .text(record.status.toUpperCase(), 450, y);

                y += 20;

                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
            });

            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateAttendancePDF };
