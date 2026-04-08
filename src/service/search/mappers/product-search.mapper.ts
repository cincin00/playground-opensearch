export interface ProductSearchDocument {
  created_at: string;
  product_name: string;
  product_price: number;
  updated_at: string;
}

export class ProductSearchMapper {
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
