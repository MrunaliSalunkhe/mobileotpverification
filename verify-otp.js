const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'your-database-host',
    user: 'your-database-username',
    password: 'your-database-password',
    database: 'otp_verification'
});

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const mobile = body.mobile;
    const otp = body.otp;

    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM otp_requests WHERE mobile = ? AND otp = ? AND created_at >= NOW() - INTERVAL 5 MINUTE', [mobile, otp], (error, results) => {
            if (error || results.length === 0) {
                resolve({
                    statusCode: 400,
                    body: JSON.stringify({ success: false, message: 'Invalid OTP' })
                });
            } else {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ success: true, message: 'OTP verified successfully' })
                });
            }
        });
    });
};
