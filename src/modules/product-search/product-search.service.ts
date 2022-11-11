import type { QueryDslQueryContainer, SearchHit, SearchTotalHits, Sort } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { isEmpty, isNumber, pickBy } from 'lodash';

import { SearchFilterQueryDto, SortType } from './dto/search-filter.query.dto';
import type { ProductSearchDocumentRO } from './product-search.interface';

@Injectable()
export class ProductSearchService {
  constructor(private readonly elasticsearch: ElasticsearchService) {}

  public async getProducts(filter: SearchFilterQueryDto): Promise<any> {
    const query = this.getProductsQuery(filter);

    const { sort: sortType = SortType.RELEVANCE, limit, offset } = filter;

    const {
      hits: { hits, total },
    } = await this.elasticsearch.search<ProductSearchDocumentRO>({
      index: process.env.ELASTICSEARCH_PRODUCT_INDEX,
      query,
      sort: this.getProductsSortQuery(sortType),
      _source: ['id', 'price', 'slug'],
      script_fields: {
        image: {
          script: {
            lang: 'painless',
            source: "params['_source'].images.stream().findFirst().orElse(null)",
          },
        },
      },
      size: limit,
      from: offset,
    });

    const resultCount = (<SearchTotalHits>total).value;

    const products = hits.map(({ _source: source, fields }: SearchHit<ProductSearchDocumentRO>) => ({
      ...source,
      preview: fields?.['image']?.[0] || {},
    }));

    return {
      products,
      metadata: {
        hasMore: limit + offset < resultCount,
        offset: offset + limit,
        resultCount,
      },
    };
  }

  private getProductsSortQuery(sortType: SortType): Sort {
    const sort:Sort = [];

    if (sortType === 'relevance') sort.push('_score');
    else if (sortType === 'recent') {
      sort.push({
        createdAt: {
          order: 'desc',
        },
      });
    } else if (sortType === 'priceMin') {
      sort.push({
        price: {
          order: 'asc',
        },
      });
    } else if (sortType === 'priceMax') {
      sort.push({
        price: {
          order: 'desc',
        },
      });
    }
    return sort;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private getProductsQuery({ search, sort: sortType, ...filter }: SearchFilterQueryDto): QueryDslQueryContainer {
    const queryFilter = [];
    const queryMust = [];

    if (search) {
      queryMust.push({
        query_string: {
          query: search
            .trim()
            .split(' ')
            .map((s) => `(${s}~)`)
            .join(' OR '),
          fields: ['brand.name', 'categories.name', 'categories.keywords', 'description', 'colors.title'],
          fuzziness: '1',
        },
      });
    }

    if (!isEmpty(filter.username)) queryFilter.push({ term: { 'user.username': filter.username } });

    if (!isEmpty(filter.categories) && Array.isArray(filter.categories)) {
      queryFilter.push({ terms: { 'categories.id': filter.categories } });
    }

    if (!isEmpty(filter.brands) && Array.isArray(filter.brands)) queryFilter.push({ terms: { 'brand.id': filter.brands } });

    if (!isEmpty(filter.conditions) && Array.isArray(filter.conditions)) {
      queryFilter.push({ terms: { 'condition.id': filter.conditions } });
    }

    if (!isEmpty(filter.sizes) && Array.isArray(filter.sizes)) queryFilter.push({ terms: { 'variants.sizeId': filter.sizes } });

    if (!isEmpty(filter.colors) && Array.isArray(filter.colors)) queryFilter.push({ terms: { 'colors.id': filter.colors } });

    if (isNumber(filter.city)) queryFilter.push({ term: { 'city.id': filter.city } });

    if (filter.minPrice || filter.maxPrice) {
      queryFilter.push({
        range: {
          price: pickBy(
            {
              gte: filter.minPrice,
              lte: filter.maxPrice,
            },
            isNumber,
          ),
        },
      });
    }

    queryFilter.push({ term: { isSold: filter.isSold || false } });
    // filter not deleted products
    queryFilter.push({ term: { isDeleted: false } });

    const query: QueryDslQueryContainer = {
      bool: {
        must: queryMust,
        filter: queryFilter,
      },
    };

    return query;
  }
}
