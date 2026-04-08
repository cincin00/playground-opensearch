import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { toSnakeCase } from '../../helper/common.helper';
import { SearchProductIndexDto } from './dto/search-product-index.dto';
import {
  ProductSearchDocument,
  ProductSearchMapper,
} from './mappers/product-search.mapper';

type SearchSortOrder = 'asc' | 'desc';

@Injectable()
export class SearchService {
  private readonly index = 'products_search';

  constructor(
    @InjectOpensearchClient()
    private readonly opensearchClient: OpensearchClient,
  ) {}

  async findOne(search_id: number) {
    const response = await this.opensearchClient.get({
      index: this.index,
      id: String(search_id),
    });

    if (!response.body.found || !response.body._source) {
      throw new NotFoundException(
        `search_id=${search_id} 색인 상품을 찾을 수 없습니다.`,
      );
    }

    return {
      item: ProductSearchMapper.toResponse(
        search_id,
        this.toDocument(response.body._source),
      ),
    };
  }

  async findAll(searchProductIndexDto: SearchProductIndexDto) {
    const page = searchProductIndexDto.page ?? 1;
    const limit = searchProductIndexDto.limit ?? 100;
    const from = (page - 1) * limit;

    const must: Array<Record<string, unknown>> = [];
    if (searchProductIndexDto.product_name) {
      must.push({
        match: { product_name: searchProductIndexDto.product_name },
      });
    }

    const query = must.length ? { bool: { must } } : { match_all: {} };

    let sort: Array<Record<string, { order: SearchSortOrder }>> | undefined;
    if (searchProductIndexDto.sortField) {
      const snakeSortField = toSnakeCase(searchProductIndexDto.sortField);
      sort = [
        {
          [snakeSortField]: {
            order:
              searchProductIndexDto.orderBy.toLowerCase() as SearchSortOrder,
          },
        },
      ];
    }

    const response = await this.opensearchClient.search({
      index: this.index,
      from,
      size: limit,
      body: {
        query,
        sort,
        track_total_hits: true,
      },
    });

    const totalHits = response.body.hits.total;
    const total =
      typeof totalHits === 'number' ? totalHits : (totalHits?.value ?? 0);
    const items = response.body.hits.hits.flatMap((hit) => {
      const source = hit._source;

      return source
        ? [ProductSearchMapper.toResponse(hit._id, this.toDocument(source))]
        : [];
    });

    return {
      page,
      limit,
      total,
      items,
    };
  }

  private async getDocumentOrThrow(
    search_id: number,
  ): Promise<ProductSearchDocument> {
    const response = await this.opensearchClient.get({
      index: this.index,
      id: String(search_id),
    });

    if (!response.body.found || !response.body._source) {
      throw new NotFoundException(
        `search_id=${search_id} 색인 상품을 찾을 수 없습니다.`,
      );
    }

    return this.toDocument(response.body._source);
  }

  private toDocument(source: Record<string, unknown>): ProductSearchDocument {
    return {
      product_name: String(source.product_name),
      product_price: Number(source.product_price),
      created_at: String(source.created_at),
      updated_at: String(source.updated_at),
    };
  }
}
