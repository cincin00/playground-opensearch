import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';

import { ProductEntity } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';

interface BulkItemResult {
  index?: {
    _id?: string;
    error?: {
      reason?: string;
      type?: string;
    };
  };
}

interface BulkResponse {
  body?: {
    errors?: boolean;
    items?: BulkItemResult[];
  };
}

@Injectable()
export class OpensearchService {
  constructor(
    @InjectOpensearchClient()
    private readonly opensearchClient: OpensearchClient,
    private readonly productService: ProductService,
  ) {}

  async getInfo() {
    return this.opensearchClient.info();
  }

  async getHealth() {
    return this.opensearchClient.cluster.health();
  }

  async bulk(index: string) {
    const normalizedIndex = index.trim();
    if (!normalizedIndex) {
      throw new BadRequestException(
        'OpenSearch 인덱스 이름은 비어 있을 수 없습니다.',
      );
    }

    const products = await this.productService.findAll();
    if (products.length === 0) {
      return {
        index: normalizedIndex,
        total: 0,
        indexed: 0,
        failed: 0,
        failures: [],
      };
    }

    const body = this.buildBulkBody(products, normalizedIndex);
    const response = (await this.opensearchClient.bulk({
      body,
      refresh: true,
    })) as BulkResponse;

    const failures =
      response.body?.items
        ?.filter((item) => item.index?.error)
        .map((item) => ({
          document_id: item.index?._id,
          type: item.index?.error?.type,
          reason: item.index?.error?.reason,
        })) ?? [];

    return {
      index: normalizedIndex,
      total: products.length,
      indexed: products.length - failures.length,
      failed: failures.length,
      hasErrors: response.body?.errors ?? false,
      failures,
    };
  }

  private buildBulkBody(products: ProductEntity[], index: string): object[] {
    const body: object[] = [];

    for (const product of products) {
      body.push({
        index: {
          _index: index,
          _id: String(product.product_id),
        },
      });
      body.push({
        product_name: product.product_name,
        product_price: Number(product.product_price),
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
      });
    }

    return body;
  }
}
