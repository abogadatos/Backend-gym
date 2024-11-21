import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
  private transporter;

  constructor() {

    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'justdoitgym12@gmail.com', 
        pass: 'urfx wsxa pdhp htlc',     
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    const mailOptions = {
      from: '"Just Do It Gym" <tu-email@gmail.com>', 
      to, 
      subject: '¡Bienvenido a Just Do It Gym!', 
      html: `
        <h1>¡Hola, ${name}!</h1>
        <p>Gracias por unirte a nuestro gimnasio <strong>Just Do It</strong>.</p>
        <p>Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
        <p>¡Prepárate para lograr tus metas y superar tus límites!</p>
      `, 
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado: ', info.response);
    } catch (error) {
      console.error('Error enviando email: ', error.message);
      throw new Error('No se pudo enviar el email de bienvenida');
    }
  }

  async sendReservatioemail(to: string, className: string, schedule: Date) {
    const formattedDate = schedule.toLocaleDateString();
    const formattedTime = schedule.toLocaleTimeString();
  
    const mailOptions = {
      from: '"Just Do It Gym" <tu-email@example.com>',
      to,
      subject: 'Confirmación de reserva de clase',
      html: `
        <h1>¡Reserva Confirmada!</h1>
        <p>Hola,</p>
        <p>Tu clase <strong>"${className}"</strong> ha sido reservada con éxito.</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${formattedTime}</p>
        <p>¡Te esperamos en el gimnasio Just Do It!</p>
      `,
    }
    await this.transporter.sendMail(mailOptions)
  
  }

  async sendCancellationEmail(to: string, className: string, schedule: Date) {
    const formattedDate = schedule.toLocaleDateString();
    const formattedTime = schedule.toLocaleTimeString();
  
    const mailOptions = {
      from: '"Just Do It Gym" <tu-email@example.com>',
      to,
      subject: 'Reserva Cancelada',
      html: `
        <h1>Reserva Cancelada</h1>
        <p>Hola,</p>
        <p>Tu reserva para la clase <strong>"${className}"</strong> ha sido cancelada.</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${formattedTime}</p>
        <p>Si esto fue un error, puedes volver a reservar desde nuestro sistema.</p>
      `,
    };
  
    await this.transporter.sendMail(mailOptions);
  }
}