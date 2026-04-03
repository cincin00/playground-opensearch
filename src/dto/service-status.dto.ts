import { ApiProperty } from '@nestjs/swagger';

export class ServiceStatusDto {
  @ApiProperty({
    example: 'playground-opensearch',
    description: '서비스 이름',
  })
  service!: string;

  @ApiProperty({
    example: 'ok',
    description: '서비스 상태',
  })
  status!: 'ok';

  @ApiProperty({
    example: '2026-04-03T10:00:00.000Z',
    description: '응답 생성 시각',
  })
  timestamp!: string;
}
