
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');

export interface SendEmailConfig {
    to: string[];
    subject: string;
    message: string;
    from: string;
}

export class MailService {

    constructor(host: string, port: number, secure: boolean, user?: string, password?: string) {
        this.smtpTransport = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: secure ? { user, password } : null
        } as SMTPTransport.Options);
    }

    smtpTransport: Transporter<SMTPTransport.SentMessageInfo>;


    validateEmail(email: string): boolean {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async sendMail(config: SendEmailConfig) {
        const mailOptions = {
            from: config.from,
            to: config.to,
            subject: config.subject,
            html: config.message
        };
        if(!this.validateConfig(config))
            throw Error("Invalid e-mail");
        await this.smtpTransport.sendMail(mailOptions);
    }

    validateConfig(config: SendEmailConfig) {
        return [config.from, ...config.to].every(this.validateEmail);
    }
}
