import { IsUUID, IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateProductDtoStripe {
  /**
   * El identificador único del producto.
   * 
   * - Debe ser un UUID válido.
   * 
   * @example "b3d0f1f7-2a68-4f4f-b38b-3fbd6452459e"
   */ 
  @ApiHideProperty()
  @IsUUID()
  @ApiProperty({
    description: 'El identificador único del producto.',
    example: 'b3d0f1f7-2a68-4f4f-b38b-3fbd6452459e',
  })
 
  id: string;

  /**
   * El nombre del producto.
   * 
   * - Debe ser una cadena de texto.
   * 
   * @example "Suscripción Premium"
   */
  @IsString()
  @ApiProperty({
    description: 'El nombre del producto.',
    example: 'Suscripción Premium',
  })
  name: string;

  /**
   * El precio del producto.
   * 
   * - Debe ser un número que represente el precio en la unidad de moneda especificada.
   * 
   * @example 19.99
   */
  @IsNumber()
  @ApiProperty({
    description: 'El precio del producto.',
    example: 19.99,
  })
  price: number;

  /**
   * La duración del producto en meses.
   * 
   * - Debe ser un número que indique la cantidad de meses que dura la suscripción o servicio.
   * 
   * @example 12
   */
  @IsNumber()
  @ApiProperty({
    description: 'La duración del producto en meses.',
    example: 12,
  })
  duration: number;

  /**
   * La descripción del producto.
   * 
   * - Debe ser una cadena de texto que proporcione detalles sobre el producto.
   * 
   * @example "Acceso a todas las funcionalidades premium durante un año."
   */
  @IsString()
  @ApiProperty({
    description: 'La descripción del producto.',
    example: 'Acceso a todas las funcionalidades premium durante un año.',
  })
  description: string;

  /**
   * La fecha de creación del producto en formato ISO 8601.
   * 
   * - Debe ser una cadena que cumpla con el formato de fecha y hora ISO 8601.
   * 
   * @example "2024-12-01T12:00:00Z"
   */
  @IsDateString()
  @ApiProperty({
    description: 'La fecha de creación del producto en formato ISO 8601.',
    example: '2024-12-01T12:00:00Z',
  })
  created_at: string;

  /**
   * La moneda utilizada para el precio del producto.
   * 
   * - Debe ser una cadena que represente la moneda, como "USD" o "EUR".
   * 
   * @example "USD"
   */
  @IsString()
  @ApiProperty({
    description: 'La moneda utilizada para el precio del producto.',
    example: 'USD',
  })
  currency: string;
}