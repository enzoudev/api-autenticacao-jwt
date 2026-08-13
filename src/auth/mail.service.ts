import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });


    this.transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Erro ao conectar com o servidor SMTP:", error);
      } else {
        console.log("✅ Servidor SMTP pronto para enviar e-mails!");
      }
    });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    try {
      console.log("Tentando enviar e-mail via transporter...");
      
      const info = await this.transporter.sendMail({
        from: `"Sua Aplicação" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Recuperação de Senha',
        html: `
          <h1>Você solicitou a recuperação de senha</h1>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${resetLink}">Redefinir Senha</a>
          <p>Se você não solicitou isso, ignore este e-mail.</p>
        `,
      });

      console.log("E-mail enviado com sucesso! Resposta:", info.response);
    } catch (error) {
      console.error("ERRO DETALHADO DO NODEMAILER:", error);
    }
  }

  async sendVerificationEmail(email: string, verificationLink: string) {
    try {
      
      const info = await this.transporter.sendMail({
        from: `"Sua Aplicação" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Verificação de E-mail',
        html: `
          <h1>Bem-vindo!</h1>
          <p>Clique no link abaixo para verificar o seu e-mail:</p>
          <a href="${verificationLink}">Verificar E-mail</a>
          <p>Se você não criou esta conta, ignore este e-mail.</p>
        `,
      });

      console.log("E-mail de verificação enviado com sucesso! Resposta:", info.response);
    } catch (error) {
      console.error("ERRO DETALHADO DO NODEMAILER:", error);
    }
  }
}