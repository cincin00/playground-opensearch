import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 상세 조회' })
  @Get(':product_id')
  findOne(@Param('product_id', ParseIntPipe) product_id: number) {
    return this.productService.findOne(product_id);
  }

  @ApiOperation({ summary: '상품 전체 조회' })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: '상품 생성' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':product_id')
  update(
    @Param('product_id', ParseIntPipe) product_id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productService.update(product_id, updateProductDto);
  }

  @ApiOperation({ summary: '상품 삭제' })
  @Delete(':product_id')
  delete(@Param('product_id', ParseIntPipe) product_id: number) {
    return this.productService.delete(product_id);
  }
}
