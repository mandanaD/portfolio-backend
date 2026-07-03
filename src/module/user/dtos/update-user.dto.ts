import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsEnum(['VISITOR', 'OWNER'])
  @ApiProperty({
    enum: ['VISITOR', 'OWNER'],
  })
  role?: string;
}
