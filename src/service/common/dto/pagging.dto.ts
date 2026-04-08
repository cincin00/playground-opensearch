import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { OrderBy } from '../enums/order-by.enum';
import { SortField } from '../enums/sort-field.enum';

export class PaggingDto {
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
  page!: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: '페이지 크기',
    default: 20,
    example: 20,
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
  @Max(100, {
    message: ({ property, constraints, value }) => {
      if (value === null || value === undefined) {
        return `${property}는 필수 항목입니다.`;
      }
      return `${property}는 최대 ${constraints[0]} 이하로 전달되어야 합니다. (현재 값: ${value})`;
    },
  })
  limit!: number;

  @ApiPropertyOptional({
    enum: SortField,
    description: '정렬 기준 필드(createdAt:생성일,updatedAt:수정일)',
    example: SortField.CREATEDAT,
  })
  @IsOptional()
  @IsEnum(SortField, {
    message: `$property은 다음 중 하나여야 합니다: ${Object.values(SortField)
      .map((v) => `'${v}'`)
      .join(', ')}`,
  })
  sortField?: SortField;

  @ApiPropertyOptional({
    enum: OrderBy,
    description: '정렬 기준(Desc:내림차순, Asc:오름차순)',
    example: OrderBy.DESC,
  })
  @IsOptional()
  @IsEnum(OrderBy, {
    message: `$property은 다음 중 하나여야 합니다: ${Object.values(OrderBy)
      .map((v) => `'${v}'`)
      .join(', ')}`,
  })
  orderBy: OrderBy = OrderBy.DESC;
}
