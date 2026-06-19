import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { ExperienceModule } from './module/experience/experience.module';
import { ProjectModule } from './module/project/project.module';
import { ProjectChallengeModule } from './module/project-challenge/project-challenge.module';
import { ResumeModule } from './module/resume/resume.module';
import { SkillCategoryModule } from './module/skill-category/skill-category.module';
import { SkillModule } from './module/skill/skill.module';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './module/prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    ExperienceModule,
    ProjectModule,
    ProjectChallengeModule,
    ResumeModule,
    SkillCategoryModule,
    SkillModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
