import { Test, TestingModule } from '@nestjs/testing';
import { ProjectChallengeController } from './project-challenge.controller';

describe('ProjectChallengeController', () => {
  let controller: ProjectChallengeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectChallengeController],
    }).compile();

    controller = module.get<ProjectChallengeController>(
      ProjectChallengeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
