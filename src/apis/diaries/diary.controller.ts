import { Body, Controller, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuthAccessToken,
  ApiDescription,
  ApiParamDescription,
  ApiTagDiary,
  GetUserId,
  TransactionManager,
} from 'src/utils/decorators';
import { DiaryService } from './diary.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@ApiTagDiary()
@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiDescription('다이어리 등록 API')
  @ApiBearerAuthAccessToken()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('create')
  async createDiary(
    @Body() dto: CreateDiaryDto,
    @GetUserId() userId: number,
    @TransactionManager() transactionManager,
  ): Promise<{ message: string; result: any }> {
    const result = await this.diaryService.createDiary(dto, userId, transactionManager);
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
}
