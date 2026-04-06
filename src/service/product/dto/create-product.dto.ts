import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '상품 이름',
    example: '노트북',
  })
  product_name!: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: '상품 가격',
    example: 1000000,
  })
  product_price!: number;
}
