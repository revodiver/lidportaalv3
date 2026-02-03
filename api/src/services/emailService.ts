import * as nodemailer from 'nodemailer';

// Email service for sending notifications
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configure SMTP transport for Office 365
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.office365.com',
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER || '',
                pass: process.env.MAIL_PASSWORD || '',
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
    }

    /**
     * Send loan notification email
     */
    async sendLoanNotification(
        recipientEmail: string,
        personName: string,
        equipmentItems: string[],
        isAdmin: boolean = false
    ): Promise<void> {
        const subject = isAdmin 
            ? `Materiaal uitgeleend aan ${personName}`
            : 'Materiaal uitgeleend';

        const equipmentList = equipmentItems.map(item => `• ${item}`).join('\n');

        const htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Materiaal Uitlening</h2>
                    <p>Hallo${isAdmin ? '' : ` ${personName}`},</p>
                    <p>${isAdmin ? `Materiaal is uitgeleend aan ${personName}:` : 'Je hebt het volgende materiaal geleend:'}</p>
                    <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0;">
                        ${equipmentList.split('\n').map(item => `<p style="margin: 5px 0;">${item}</p>`).join('')}
                    </div>
                    <p>Datum: ${new Date().toLocaleDateString('nl-NL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    ${!isAdmin ? '<p>Breng het materiaal op tijd terug in goede staat.</p>' : ''}
                    <p>Met vriendelijke groet,<br/>Duikvereniging Materiaal Beheer</p>
                </body>
            </html>
        `;

        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: recipientEmail,
            subject: subject,
            html: htmlContent
        });
    }

    /**
     * Send return notification email
     */
    async sendReturnNotification(
        recipientEmail: string,
        personName: string,
        equipmentItems: string[],
        isAdmin: boolean = false
    ): Promise<void> {
        const subject = isAdmin 
            ? `Materiaal teruggebracht door ${personName}`
            : 'Materiaal teruggebracht';

        const equipmentList = equipmentItems.map(item => `• ${item}`).join('\n');

        const htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Materiaal Teruggebracht</h2>
                    <p>Hallo${isAdmin ? '' : ` ${personName}`},</p>
                    <p>${isAdmin ? `Materiaal is teruggebracht door ${personName}:` : 'Je hebt het volgende materiaal teruggebracht:'}</p>
                    <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0;">
                        ${equipmentList.split('\n').map(item => `<p style="margin: 5px 0;">${item}</p>`).join('')}
                    </div>
                    <p>Datum: ${new Date().toLocaleDateString('nl-NL', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    ${!isAdmin ? '<p>Bedankt voor het tijdig terugbrengen van het materiaal.</p>' : ''}
                    <p>Met vriendelijke groet,<br/>Duikvereniging Materiaal Beheer</p>
                </body>
            </html>
        `;

        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: recipientEmail,
            subject: subject,
            html: htmlContent
        });
    }
}
