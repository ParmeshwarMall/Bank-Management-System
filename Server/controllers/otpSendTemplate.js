const template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="background-color: #f4f4f4; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <!-- Email Container -->
                <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" border="0" style="background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="padding: 20px; background: #007bff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h2 style="color: #ffffff; margin: 0;">Bharat Bank</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <h3 style="color: #333;">Your OTP Code</h3>
                            <p style="color: #555; font-size: 16px;">
                                Use the OTP below to verify that its you. This OTP is valid for 10 minutes.
                            </p>
                            <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">
                                {OTP_CODE}
                            </p>
                            <p style="color: #555; font-size: 14px;">
                                If you did not request this, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 15px; background: #f4f4f4; font-size: 12px; color: #777;">
                            © 2025 Bharat Bank. All rights reserved.
                        </td>
                    </tr>
                </table>
                <!-- End Email Container -->
            </td>
        </tr>
    </table>
</body>
</html>
`;

export default template
