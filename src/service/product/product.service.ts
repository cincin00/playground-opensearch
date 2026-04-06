import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  findOne(product_id: number) {
    return this.productRepository.findOneBy({ product_id });
  }

  findAll() {
    return this.productRepository.find();
  }

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);

    return this.productRepository.save(product);
  }

  async update(product_id: number, updateProductDto: CreateProductDto) {
    const product = await this.productRepository.preload({
      product_id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(
        `product_id=${product_id} 상품을 찾을 수 없습니다.`,
      );
    }

    return this.productRepository.save(product);
  }

  delete(product_id: number) {
    return this.productRepository.delete({ product_id });
  }
}
