import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PaggingDto } from '../../common/dto/pagging.dto';

export class SearchProductIndexDto extends PaggingDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: '페이지 번호',
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsNotEmpty({
    message: '$property은 필수 항목입니다.',
  })
  @IsInt({ message: '$property는 숫자형 형태여야 합니다.' })
  @Min(1, {
    message: ({ property, constraints, value }) => {
      if (value === null || value === undefined) {
        return `${property}는 필수 항목입니다.`;
      }
      return `${property}는 최대 ${constraints[0]} 이하로 전달되어야 합니다. (현재 값: ${value})`;
    },
  })
  declare page: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: '페이지 크기(최대 10,000)',
    default: 100,
    example: 100,
  })
  @Type(() => Number)
  @IsInt({ message: '$property는 숫자형 형태여야 합니다.' })
  @Min(1, {
    message: ({ property, constraints, value }) => {
      if (value === null || value === undefined) {
        return `${property}는 필수 항목입니다.`;
      }
      return `${property}는 최대 ${constraints[0]} 이하로 전달되어야 합니다. (현재 값: ${value})`;
    },
  })
  @Max(10000, {
    message: ({ property, constraints, value }) => {
      if (value === null || value === undefined) {
        return `${property}는 필수 항목입니다.`;
      }
      return `${property}는 최대 ${constraints[0]} 이하로 전달되어야 합니다. (현재 값: ${value})`;
    },
  })
  declare limit: number;

  @ApiPropertyOptional({
    description: '상품명',
  })
  @IsOptional()
  @IsString({ message: '$property는 문자형 형태여야 합니다.' })
  product_name?: string;
}
