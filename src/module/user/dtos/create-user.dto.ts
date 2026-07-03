import { IsEnum, IsOptional } from 'class-validator';
import { SignupDto } from '../../auth/dtos/signup.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends SignupDto {
  @IsOptional()
  @IsEnum(['VISITOR', 'OWNER'])
  @ApiProperty({
    enum: ['VISITOR', 'OWNER'],
  })
  role: string;
}
