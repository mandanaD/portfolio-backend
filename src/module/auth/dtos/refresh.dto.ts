import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  refresh_token: string;
}
