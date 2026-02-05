import { Module } from '@nestjs/common';
import { ExperienceBookingController } from './experience-booking.controller';
import { ExperienceBookingService } from './experience-booking.service';
import { experienceBookingProviders } from './experience-booking.providers';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ExperienceBookingController],
  providers: [
    ExperienceBookingService,
    ...experienceBookingProviders,
    JwtService
  ]
})
export class ExperienceBookingModule {}
