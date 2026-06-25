import { IsEnum, IsOptional } from 'class-validator';
import { SignupDto } from '../../auth/dtos/signup.dto';

export class CreateUserDto extends SignupDto {
  @IsOptional()
  @IsEnum(['VISITOR', 'OWNER'])
  role: string;
}
