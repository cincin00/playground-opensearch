import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSearchProductDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: '색인 문서 ID',
    example: 1,
  })
  @Type(() => Number)
  @IsNotEmpty({
    message: '$property은 필수 항목입니다.',
  })
  @IsInt({ message: '$property는 숫자형 형태여야 합니다.' })
  @Min(1, {
    message: '$property는 1 이상이어야 합니다.',
  })
  search_id!: number;

  @ApiProperty({
    required: true,
    type: String,
    description: '상품명',
    example: '노트북',
  })
  @IsNotEmpty({
    message: '$property은 필수 항목입니다.',
  })
  @IsString({ message: '$property는 문자형 형태여야 합니다.' })
  product_name!: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: '상품 가격',
    example: 1000000,
  })
  @Type(() => Number)
  @IsNotEmpty({
    message: '$property은 필수 항목입니다.',
  })
  @IsNumber(
    {},
    {
      message: '$property는 숫자형 형태여야 합니다.',
    },
  )
  @Min(0, {
    message: '$property는 0 이상이어야 합니다.',
  })
  product_price!: number;
}
