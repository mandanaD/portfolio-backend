import { Module } from '@nestjs/common';
import { ProjectChallengeController } from './project-challenge.controller';
import { ProjectChallengeService } from './project-challenge.service';

@Module({
  controllers: [ProjectChallengeController],
  providers: [ProjectChallengeService]
})
export class ProjectChallengeModule {}
