import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ContactRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  subject?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message!: string;
}

export interface ContactResponseDto {
  success: boolean;
  receivedAt: string;
  id: string; // ephemeral id for tracking (not persisted yet)
}
