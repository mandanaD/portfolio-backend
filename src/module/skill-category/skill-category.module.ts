import { Module } from '@nestjs/common';
import { SkillCategoryController } from './skill-category.controller';
import { SkillCategoryService } from './skill-category.service';

@Module({
  controllers: [SkillCategoryController],
  providers: [SkillCategoryService]
})
export class SkillCategoryModule {}
