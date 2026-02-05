import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ExperienceBookingDto, ExperiencePayRequestBookingDto, PayoutUpdatedEvent, TransactionUpdatedEvent } from './dto/create-experience-booking.dto';
import { ExperienceBookingService } from './experience-booking.service';
import { UserAccessGuard } from 'apps/core/src/auth/user.access.guard';
import { JwtRequest } from 'apps/core/src/auth/auth.dto';
import { Response } from 'express';
import { ExperienceBookingStatus } from 'database/enitity/ExperienceBooking.entity';

@Controller('experience-booking')
export class ExperienceBookingController {

    constructor(
        private readonly experienceBookingService: ExperienceBookingService
    ) { }

    @Post('')
    @UseGuards(UserAccessGuard)
    async makePayment(
        @Body() bookingDto: ExperienceBookingDto,
        @Req() req: JwtRequest
    ) {
        const data = await this.experienceBookingService.makePayment(bookingDto, req.user.id)
        return {
            statusCode: 200,
            data
        }
    }

    @Patch('')
    @UseGuards(UserAccessGuard)
    async payRequestBooking(
        @Body() bookingDto: ExperiencePayRequestBookingDto,
        @Req() req: JwtRequest
    ) {
        const data = await this.experienceBookingService.payRequestBooking(req.user.id, bookingDto.id)
        return {
            statusCode: 200,
            data
        }
    }

    @Get("booking/:id")
    async getBooking(
        @Param('id') id: string
    ) {
        const data = await this.experienceBookingService.getBooking(id)
        return {
            statusCode: 200,
            data
        }
    }

    @Get("trips/previous")
    @UseGuards(UserAccessGuard)
    async getTrips(
        @Req() req: JwtRequest

    ) {
        const data = await this.experienceBookingService.getTrips(req.user.id, "previous")
        return {
            statusCode: 200,
            data
        }
    }

    @Get("bookings/previous")
    @UseGuards(UserAccessGuard)
    async getBookings(
        @Req() req: JwtRequest

    ) {
        const data = await this.experienceBookingService.getBookings(req.user.id, "previous")
        return {
            statusCode: 200,
            data
        }
    }

    @Get("trips/upcoming")
    @UseGuards(UserAccessGuard)
    async getTripsComing(
        @Req() req: JwtRequest

    ) {
        const data = await this.experienceBookingService.getTrips(req.user.id, "upcoming")
        return {
            statusCode: 200,
            data
        }
    }

    @Get("bookings/upcoming")
    @UseGuards(UserAccessGuard)
    async getBookingsUpcoming(
        @Req() req: JwtRequest

    ) {
        const data = await this.experienceBookingService.getBookings(req.user.id, "upcoming")
        return {
            statusCode: 200,
            data
        }
    }

    @Get("wompi/callback/:id")
    async wombiCallback(
        @Param('id') id: string,
        @Query() query: any,
        @Res() res: Response
    ) {
        const data = await this.experienceBookingService.wombiCallback(id, query)
        res.redirect(process.env.ITINERARY_URL + id)
        // return {
        //     statusCode: 200,
        //     data: query
        // }
    }

    @Post("wompi/webhook")
    @HttpCode(200)
    async wombiWebhook(
        @Body() body: TransactionUpdatedEvent
    ) {
        console.log(body);

        const data = await this.experienceBookingService.wombiwebhook(body)

    }

    @Post("wompi/webhook/payout")
    @HttpCode(200)
    async wombiWebhookPayout(
        @Body() body: PayoutUpdatedEvent
    ) {
        console.log(body);

        const data = await this.experienceBookingService.wombiwebhookPayout(body)

    }

    @Get('admin/all')
    async getAllBookings(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string,
        @Query('sortColumn') sortColumn: "status" | "requestDate" | "paymentDate" | "expDate" | "totalPayment",
        @Query('sortOrder') sortOrder: "ASC" | "DESC",
        @Query('category') category: string,
        @Query('status') status: ExperienceBookingStatus,
        @Query('filterDateBy') filterDateBy: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const data = await this.experienceBookingService.getAllBookings(
            parseInt(page) || 1,
            parseInt(limit) || 10,
            search || "",
            sortColumn,
            sortOrder,
            status,
            category,
            filterDateBy,
            startDate,
            endDate
        )
        return {
            statusCode: 200,
            data: data.data,
            total: data.total
        }
    }

    @Patch('cancel/:id')
    @UseGuards(UserAccessGuard)
    async cancelBooking(
        @Param('id') bookingId: string,
        @Body('message') message: string,
        @Req() req: JwtRequest
    ) {
        const data = await this.experienceBookingService.cancelBooking(bookingId, req.user.id, message)
        return {
            statusCode: 200,
            data
        }
    }

    @Get('admin/stats')
    async getAdminStats() {
        const data = await this.experienceBookingService.bookingStats()
        return {
            statusCode: 200,
            data
        }
    }

    @Get('admin/csv')
    async getBookingsCSV(
        @Res() res: Response,
        @Query('search') search: string,
        @Query('sortColumn') sortColumn: "status" | "requestDate" | "paymentDate" | "expDate" | "totalPayment",
        @Query('sortOrder') sortOrder: "ASC" | "DESC",
        @Query('category') category: string,
        @Query('status') status: ExperienceBookingStatus,
        @Query('filterDateBy') filterDateBy: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Res() response: Response
    ) {
        await this.experienceBookingService.getAllBookingsCSV(response);
    }

}
