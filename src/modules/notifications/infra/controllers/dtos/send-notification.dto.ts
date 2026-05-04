import 'reflect-metadata';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  ValidateIf,
} from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === 'EMAIL')
  @IsEmail()
  @ValidateIf((o) => o.type === 'SMS')
  @IsPhoneNumber()
  targetContact: string; // type=EMAIL → must be email; type=SMS → must be phone

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['EMAIL', 'SMS'])
  type: 'EMAIL' | 'SMS';
}
