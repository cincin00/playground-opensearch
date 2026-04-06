import { Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({ summary: '상품 생성' })
    @Post()
    create() {
        // 상품 생성 로직
    }

    @ApiOperation({ summary: '상품 조회' })
    @Get()
    findAll() {
        // 상품 조회 로직
    }
}
