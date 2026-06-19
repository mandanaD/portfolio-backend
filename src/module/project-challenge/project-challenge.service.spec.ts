import { Test, TestingModule } from '@nestjs/testing';
import { ProjectChallengeService } from './project-challenge.service';

describe('ProjectChallengeService', () => {
  let service: ProjectChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectChallengeService],
    }).compile();

    service = module.get<ProjectChallengeService>(ProjectChallengeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
