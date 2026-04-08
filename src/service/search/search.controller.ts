import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ApiOperation } from '@nestjs/swagger';
import { CreateSearchProductDto } from './dto/create-search-product.dto';
import { SearchProductIndexDto } from './dto/search-product-index.dto';
import { UpdateSearchProductDto } from './dto/update-search-product.dto';
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

  @ApiOperation({
    summary: 'OpenSearch 상품 색인',
    description: '상품 문서를 OpenSearch 인덱스에 생성합니다.',
  })
  @Post()
  create(@Body() createSearchProductDto: CreateSearchProductDto) {
    return this.searchService.create(createSearchProductDto);
  }

  @ApiOperation({
    summary: 'OpenSearch 상품 색인 수정',
    description: 'search_id로 OpenSearch에 색인된 상품 문서를 수정합니다.',
  })
  @Put(':search_id')
  update(
    @Param('search_id', ParseIntPipe) search_id: number,
    @Body() updateSearchProductDto: UpdateSearchProductDto,
  ) {
    return this.searchService.update(search_id, updateSearchProductDto);
  }

  @ApiOperation({
    summary: 'OpenSearch 상품 색인 삭제',
    description: 'search_id로 OpenSearch에 색인된 상품 문서를 삭제합니다.',
  })
  @Delete(':search_id')
  delete(@Param('search_id', ParseIntPipe) search_id: number) {
    return this.searchService.delete(search_id);
  }
}
