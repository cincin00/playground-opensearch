import { CreateSearchProductDto } from '../dto/create-search-product.dto';
import { UpdateSearchProductDto } from '../dto/update-search-product.dto';

export interface ProductSearchDocument {
  created_at: string;
  product_name: string;
  product_price: number;
  updated_at: string;
}

export class ProductSearchMapper {
  static toDocument(
    createSearchProductDto: CreateSearchProductDto,
    timestamp: string,
  ): ProductSearchDocument {
    return {
      product_name: createSearchProductDto.product_name,
      product_price: createSearchProductDto.product_price,
      created_at: timestamp,
      updated_at: timestamp,
    };
  }

  static mergeDocument(
    currentDocument: ProductSearchDocument,
    updateSearchProductDto: UpdateSearchProductDto,
    timestamp: string,
  ): ProductSearchDocument {
    return {
      ...currentDocument,
      ...(updateSearchProductDto.product_name !== undefined
        ? {
            product_name: updateSearchProductDto.product_name,
          }
        : {}),
      ...(updateSearchProductDto.product_price !== undefined
        ? {
            product_price: updateSearchProductDto.product_price,
          }
        : {}),
      updated_at: timestamp,
    };
  }

  static toResponse(
    searchId: string | number,
    document: ProductSearchDocument,
  ): {
    created_at: string;
    product_name: string;
    product_price: number;
    search_id: number | string;
    updated_at: string;
  } {
    const normalizedSearchId = Number(searchId);

    return {
      search_id: Number.isNaN(normalizedSearchId)
        ? String(searchId)
        : normalizedSearchId,
      ...document,
    };
  }
}
