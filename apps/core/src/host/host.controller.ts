import { Controller, Get, Post, Body, UseGuards, Req, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { HostService } from './host.service';
import { CreateHostDto, UpdateBankDto, UpdateBasicDto, UpdateHostTerm, UpdateTaxDto } from './dto/create-host.dto';
import { UserAccessGuard } from '../auth/user.access.guard';
import { JwtRequest } from '../auth/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerPdfOptions } from 'lib/multerConfig';
import { HostDocumentType } from 'database/enitity/host/HostDocument.entity';
import { AuthAccessGuard } from '../auth/auth.access.guard';

@Controller('host')
export class HostController {
  constructor(private readonly hostService: HostService) { }

  @Post()
  @UseGuards(UserAccessGuard)
  async create(
    @Body() createHostDto: CreateHostDto,
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.create(createHostDto, req.user.id);
    return {
      statusCode: 200,
      data
    }
  }

  @Put('basic')
  @UseGuards(UserAccessGuard)
  async updateBasic(
    @Body() dto: UpdateBasicDto,
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.updateBasic(dto, req.user.id);
    return {
      statusCode: 200,
      data
    }
  }

  @Put('bank')
  @UseGuards(UserAccessGuard)
  async updateBank(
    @Body() dto: UpdateBankDto,
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.updateBank(dto, req.user.id);
    return {
      statusCode: 200,
      data
    }
  }

  @Put('tax')
  @UseGuards(UserAccessGuard)
  async updateTax(
    @Body() dto: UpdateTaxDto,
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.updateTax(dto, req.user.id);
    return {
      statusCode: 200,
      data
    }
  }

  @Put('terms')
  @UseGuards(UserAccessGuard)
  async updateTerms(
    @Body() dto: UpdateHostTerm,
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.updateTerms(req.user.id, dto);
    return {
      statusCode: 200,
      data
    }
  }

  @Get()
  @UseGuards(UserAccessGuard)
  async findOne(
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.findOne(req.user.id);
    return {
      statusCode: 200,
      data
    }

  }

  @Post('document')
  @UseGuards(UserAccessGuard)
  @UseInterceptors(FileInterceptor('file', multerPdfOptions("DOCUMENT_PATH")))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: JwtRequest,
    @Body('type') type: HostDocumentType,
  ) {
    const data = await this.hostService.uploadDocument(req.user.id, file, type);

    return {
      statusCode: 200,
      data
    }
  }

  @Post('status')
  async updateStatus(
    @Body('status') status: boolean,
    @Body('id') id: number
  ) {
    const data = await this.hostService.updateStatus(status, id);

    return {
      statusCode: 200,
      data
    }
  }

  @Get('active')
  @UseGuards(AuthAccessGuard)
  async findActiveHosts() {
    const data = await this.hostService.findActiveHosts()
    return {
      statusCode: 200,
      data
    }
  }

  @Post('service-fee')
  @UseGuards(AuthAccessGuard)
  async updateHostServiceFee(
    @Body('fee') fee: number,
    @Body('hostId') userId: string,
  ) {
    await this.hostService.updateHostServiceFee(userId, fee)
    return {
      statusCode: 200
    }
  }


  @Get('dashboard')
  @UseGuards(UserAccessGuard)
  async adminDashboard(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: JwtRequest
  ) {
    const data = await this.hostService.adminDashboard(+startDate, +endDate, req.user.id)
    return {
      statusCode: 200,
      data
    }
  }



}
