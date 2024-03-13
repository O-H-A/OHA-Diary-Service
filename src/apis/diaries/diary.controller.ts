import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiParamDescription,
  ApiTagDiary,
  GetUserId,
  GetUserToken,
  TransactionManager,
} from 'src/utils/decorators';
import { DiaryService } from './diary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

@ApiTagDiary()
@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiDescription('다이어리 등록 API')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor, FileInterceptor('file'))
  @Post('create')
  async createDiary(
    @Body() dto: CreateDiaryDto,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.createDiary(dto, file.filename, userId, transactionManager);
    return { message: '등록 성공', result };
  }

  @ApiDescription('다이어리 수정 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('update/:diaryId')
  async updateDiary(
    @Param('diaryId') diaryId: number,
    @Body() dto: UpdateDiaryDto,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.updateDiary(diaryId, userId, dto, transactionManager);
    return { message: '수정 성공' };
  }

  @ApiDescription('다이어리 삭제 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('delete/:diaryId')
  async deleteDiary(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.deleteDiary(diaryId, userId, transactionManager);
    return { message: '삭제 성공' };
  }

  @ApiDescription('다이어리 상세 조회 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Get('read/:diaryId')
  async readDiaryDetail(
    @Param('diaryId') diaryId: number,
    @GetUserToken() token: string,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readDiaryDetail(diaryId, token, transactionManager);
    return { message: '상세 조회 성공', result };
  }

  @ApiDescription('다이어리 좋아요 생성 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('uplike/:diaryId')
  async createDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.createDiaryLike(diaryId, userId, transactionManager);
    return { message: '좋아요 생성 성공' };
  }

  @ApiDescription('다이어리 좋아요 취소 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('downlike/:diaryId')
  async deleteDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string }> {
    await this.diaryService.deleteDiaryLike(diaryId, userId, transactionManager);
    return { message: '좋아요 취소 성공' };
  }

  @ApiDescription('다이어리 좋아요 정보 조회 API')
  @ApiParamDescription('diaryId', '숫자로 입력해주세요')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('getlike/:diaryId')
  async getDiaryLike(
    @Param('diaryId') diaryId: number,
    @GetUserId() userId: number,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.getDiaryLike(diaryId, userId);
    return { message: '좋아요 정보 조회 성공', result };
  }

  @ApiDescription('사용자가 작성한 다이어리 조회(달력표시용 - 월별) API')
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('my/calender/month')
  async readUserDiaryMonthly(
    @GetUserId() userId: number,
    @GetUserToken() token: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readUserDiaryMonthly(userId, year, month, token);
    return { message: '조회 성공', result };
  }

  @ApiDescription('사용자가 작성한 다이어리 조회(달력표시용 - 주별)  API')
  @ApiBearerAuthAccessToken()
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'week', required: false })
  @UseGuards(JwtAuthGuard)
  @Get('my/calender/week')
  async readUserDiaryWeekly(
    @GetUserId() userId: number,
    @GetUserToken() token: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('week') week: number,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readUserDiaryWeekly(userId, token, year, month, week);
    return { message: '조회 성공', result };
  }

  @ApiDescription('사용자가 작성한 다이어리 조회(달력표시용 - 일별)  API')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('my/calender/day')
  async readUserDiaryDaily(@GetUserId() userId: number): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readUserDiaryDaily(userId);
    return { message: '조회 성공', result };
  }

  @ApiDescription('사용자가 작성한 다이어리 전체 조회 API')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async readUserDiary(
    @GetUserId() userId: number,
    @GetUserToken() token: string,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.readUserDiary(userId, token);
    return { message: '조회 성공', result };
  }

  @ApiDescription('다이어리 신고하기 API')
  @Post('report')
  async reportDiary() {}
}
