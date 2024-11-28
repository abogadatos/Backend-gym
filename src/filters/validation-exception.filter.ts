import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const { message } = exceptionResponse as any;

    if (Array.isArray(message)) {
      this.logger.error('Validación fallida:', message);
      //   message.forEach((err) => this.logger.error(err));
    } else {
      this.logger.error(`Validation Error: ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      error: 'Bad Request',
      validationErrors: message,
    });
  }
}
