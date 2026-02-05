import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceBookingService } from './experience-booking.service';

describe('ExperienceBookingService', () => {
  let service: ExperienceBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceBookingService],
    }).compile();

    service = module.get<ExperienceBookingService>(ExperienceBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
