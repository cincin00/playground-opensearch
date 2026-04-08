import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { toSnakeCase } from '../../helper/common.helper';
import { CreateSearchProductDto } from './dto/create-search-product.dto';
import { SearchProductIndexDto } from './dto/search-product-index.dto';
import { UpdateSearchProductDto } from './dto/update-search-product.dto';
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

  async create(createSearchProductDto: CreateSearchProductDto) {
    const searchId = String(createSearchProductDto.search_id);
    const existsResponse = await this.opensearchClient.exists({
      index: this.index,
      id: searchId,
    });

    if (existsResponse.body) {
      throw new ConflictException(
        `search_id=${createSearchProductDto.search_id} 색인 상품이 이미 존재합니다.`,
      );
    }

    const document = ProductSearchMapper.toDocument(
      createSearchProductDto,
      new Date().toISOString(),
    );

    const response = await this.opensearchClient.index({
      index: this.index,
      id: searchId,
      refresh: true,
      body: document,
    });

    return {
      search_id: createSearchProductDto.search_id,
      result: response.body.result,
      item: ProductSearchMapper.toResponse(response.body._id, document),
    };
  }

  async update(
    search_id: number,
    updateSearchProductDto: UpdateSearchProductDto,
  ) {
    if (
      updateSearchProductDto.product_name === undefined &&
      updateSearchProductDto.product_price === undefined
    ) {
      throw new BadRequestException(
        '최소 한 개 이상의 색인 상품 수정 값이 필요합니다.',
      );
    }

    const currentDocument = await this.getDocumentOrThrow(search_id);
    const nextDocument = ProductSearchMapper.mergeDocument(
      currentDocument,
      updateSearchProductDto,
      new Date().toISOString(),
    );

    const response = await this.opensearchClient.update({
      index: this.index,
      id: String(search_id),
      refresh: true,
      body: {
        doc: nextDocument,
      },
    });

    return {
      search_id,
      result: response.body.result,
      item: ProductSearchMapper.toResponse(search_id, nextDocument),
    };
  }

  async delete(search_id: number) {
    await this.getDocumentOrThrow(search_id);

    const response = await this.opensearchClient.delete({
      index: this.index,
      id: String(search_id),
      refresh: true,
    });

    return {
      search_id,
      result: response.body.result,
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
