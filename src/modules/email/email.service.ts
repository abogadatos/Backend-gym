import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Configura el transporte con tu proveedor de email
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Cambia según tu proveedor (por ejemplo, Outlook, Yahoo)
      auth: {
        user: 'justdoitgym12@gmail.com', // Tu email
        pass: 'urfx wsxa pdhp htlc',     // Contraseña o clave de aplicación
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    const mailOptions = {
      from: '"Just Do It Gym" <tu-email@gmail.com>', // Nombre y email del gym
      to, // Email del user
      subject: '¡Bienvenido a Just Do It Gym!', // Asunto del email
      html: `
        <h1>¡Hola, ${name}!</h1>
        <p>Gracias por unirte a nuestro gimnasio <strong>Just Do It</strong>.</p>
        <p>Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
        <p>¡Prepárate para lograr tus metas y superar tus límites!</p>
      `, // Contenido del email en HTML
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado: ', info.response);
    } catch (error) {
      console.error('Error enviando email: ', error.message);
      throw new Error('No se pudo enviar el email de bienvenida');
    }
  }
}
