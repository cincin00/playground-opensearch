import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSearchProductDto {
  @ApiPropertyOptional({
    type: String,
    description: '상품명',
    example: '게이밍 노트북',
  })
  @IsOptional()
  @IsString({ message: '$property는 문자형 형태여야 합니다.' })
  product_name?: string;

  @ApiPropertyOptional({
    type: Number,
    description: '상품 가격',
    example: 1200000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber(
    {},
    {
      message: '$property는 숫자형 형태여야 합니다.',
    },
  )
  @Min(0, {
    message: '$property는 0 이상이어야 합니다.',
  })
  product_price?: number;
}
