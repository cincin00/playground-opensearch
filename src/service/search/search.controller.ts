import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ApiOperation } from '@nestjs/swagger';
import { SearchProductIndexDto } from './dto/search-product-index.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({
    summary: 'OpenSearch 상품 전체 조회',
    description: 'OpenSearch에 색인된 전체 상품 문서를 반환합니다.',
  })
  @Get()
  findAll(@Query() searchProductIndexDto: SearchProductIndexDto) {
    return this.searchService.findAll(searchProductIndexDto);
  }

  @ApiOperation({
    summary: 'OpenSearch 상품 상세 조회',
    description: 'search_id로 OpenSearch에 색인된 상품 문서를 반환합니다.',
  })
  @Get(':search_id')
  findOne(@Param('search_id', ParseIntPipe) search_id: number) {
    return this.searchService.findOne(search_id);
  }
}
