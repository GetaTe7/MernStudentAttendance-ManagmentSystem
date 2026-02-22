const nodemailer = require('nodemailer');

/**
 * Service to send emails for low attendance warnings
 * @param {string} to - Student's email
 * @param {Object} data - Warning data (Course name, current percentage)
 */
const sendAttendanceWarning = async (to, data) => {
    try {
        // Create transporter (Example using Gmail SMTP - User needs to provide credentials)
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Attendance System" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Attendance Warning: ${data.courseName}`,
            html: `
        <h2>Low Attendance Warning</h2>
        <p>Dear Student,</p>
        <p>Your attendance in the course <strong>${data.courseName}</strong> has dropped to <strong>${data.percentage}%</strong>.</p>
        <p>Please note that the minimum required attendance is 75%. Failing to meet this requirement may affect your eligibility for examinations.</p>
        <p>Regards,<br>Academic Department</p>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendAttendanceWarning };
