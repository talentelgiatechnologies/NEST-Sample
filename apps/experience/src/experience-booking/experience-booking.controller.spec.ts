import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceBookingController } from './experience-booking.controller';

describe('ExperienceBookingController', () => {
  let controller: ExperienceBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceBookingController],
    }).compile();

    controller = module.get<ExperienceBookingController>(ExperienceBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
