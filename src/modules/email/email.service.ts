import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jusdoitgym@gmail.com',
        pass: 'iwre qwef dqlh sqhq',
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    const mailOptions = {
      from: '"Just Do It Gym" <jusdoitgym@gmail.com>',
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

  async sendReservationEmail( email: string, className:string, day:string, startTime:string,) {

    const mailOptions = {
      from: '"Just Do It Gym" <jusdoitgym@gmail.com>',
      to:email,
      subject: 'Confirmación de reserva de clase',
      html: `
        <h1>¡Reserva Confirmada!</h1>
        <p>Hola</p>
        <p>Tu clase <strong>"${className}"</strong> ha sido reservada con éxito.</p>
        <p><strong>Fecha:</strong> ${day}</p>
        <p><strong>Hora:</strong> ${startTime}</p>
        <p>¡Te esperamos en el gimnasio Just Do It!</p>
      `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendCancellationEmail(to: string, className: string, schedule: Date) {
    const formattedDate = schedule.toLocaleDateString();
    const formattedTime = schedule.toLocaleTimeString();

    const mailOptions = {
      from: '"Just Do It Gym" <jusdoitgym@gmail.com>',
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

  async sendClassUpdateEmail(recipients: string[],className: string,newSchedule: string,) {
 
    const mailOptions={
          from:'"Just Do It Gym" <jusdoitgym@gmail.com>' ,
          to: recipients,
          subject:`Actualización en la clase "${className}"`,
          text:`Queremos informarte que tu clase de "${className}" ha cambiado de horario. Ahora se dará el día ${newSchedule}.`,
          html:`
      <p>Queremos informarte que tu clase de <strong>"${className}"</strong> ha cambiado de horario.</p>
      <p>Ahora se dará el día <strong>${newSchedule}</strong>.</p>
      <p>Gracias por ser parte de nuestro gimnasio. ¡Nos vemos en la clase!</p>`
    }
    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Correos enviados a los inscritos de la clase "${className}".`);
    } catch (error) {
      console.error('Error al enviar correos: ', error);
    }
  }
  async sendClassCancellationEmail(recipients: string[], className: string){
    const mailOptions={
      from:'"Just Do It Gym" <jusdoitgym@gmail.com>' ,
      to: recipients,
      subject:`cancelacion de la clase "${className}"`,
      text:`Queremos informarte que tu clase de "${className}" ha sido cancelada y ya no estará disponible.`,
      html:`
  <p>Por favor, consulta otras opciones en nuestro calendario de actividades.</p>
  <p>Disculpa las molestias ocasionadas.<br></p>
  <p><br>
    Saludos cordiales,<br>
    El equipo de gestión del gimnasio.
    </p>

  `
}
  try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Correos enviados a los inscritos de la clase "${className}".`);
    } catch (error) {
      console.error('Error al enviar correos: ', error);
    }
  }

  async sendMembershipNotificationEmail(to: string, name: string, membershipName: string): Promise<void> {
    const mailOptions = {
      from: '"Just Do It Gym" <jusdoitgym@gmail.com>',
      to,
      subject: '¡Compra de Membresía Exitosa!',
      html: `
        <h1>¡Hola, ${name}!</h1>
        <p>Gracias por adquirir la membresía <strong>${membershipName}</strong> en <strong>Just Do It Gym</strong>.</p>
        <p>Estamos emocionados de verte aprovechar al máximo esta experiencia.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Prepárate para alcanzar tus metas!</p>
      `,
    };
  
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Notificación de membresía enviada: ', info.response);
    } catch (error) {
      console.error('Error enviando la notificación de membresía: ', error.message);
      throw new Error('No se pudo enviar la notificación de membresía');
    }
  }
  

  
}
