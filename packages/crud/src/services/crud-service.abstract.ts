import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ParsedRequestParams } from '@rettechnologys/crud-request';
import { objKeys } from '@rettechnologys/crud-util';

import {
  CreateManyDto,
  CrudRequest,
  CrudRequestOptions,
  GetManyDefaultResponse,
  ILinkPage,
  IPaginationOptionsRoutingLabels,
  QueryOptions,
} from '../interfaces';
import { updateUrlParameter } from '../util';

export abstract class CrudService<T, DTO = T> {
  abstract getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;

  abstract getOne(req: CrudRequest): Promise<T>;

  abstract createOne(req: CrudRequest, dto: DTO): Promise<T>;

  abstract createMany(req: CrudRequest, dto: CreateManyDto): Promise<T[]>;

  abstract updateOne(req: CrudRequest, dto: DTO): Promise<T>;

  abstract replaceOne(req: CrudRequest, dto: DTO): Promise<T>;

  abstract deleteOne(req: CrudRequest): Promise<void | T>;

  abstract recoverOne(req: CrudRequest): Promise<void | T>;

  throwBadRequestException(msg?: any): BadRequestException {
    throw new BadRequestException(msg);
  }

  throwNotFoundException(name: string): NotFoundException {
    throw new NotFoundException(`${name} not found`);
  }

  /**
   * Wrap page into page-info
   * override this method to create custom page-info response
   * or set custom `serialize.getMany` dto in the controller's CrudOption
   * @param data
   * @param total
   * @param limit
   * @param offset
   */
  createPageInfo(
    data: T[],
    total: number,
    limit: number,
    offset: number,
    route?: string,
    routingLabels?: IPaginationOptionsRoutingLabels,
  ): GetManyDefaultResponse<T> {
    /* retts was here */
    const itemFound = data.length;
    const itemTotal = total;
    const itemPerPage = limit;
    const totalPage = limit && total ? Math.ceil(total / limit) : 1;
    const currentPage = limit ? Math.floor(offset / limit) + 1 : 1;

    const hasFirstPage = route;
    const hasPreviousPage = route && currentPage > 1;
    const hasNextPage = route && itemTotal !== undefined && currentPage < totalPage;
    const hasLastPage = route && itemTotal !== undefined && totalPage > 0;
    const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';

    const limitLabel =
      routingLabels && routingLabels.limitLabel ? routingLabels.limitLabel : 'limit';

    const pageLabel =
      routingLabels && routingLabels.pageLabel ? routingLabels.pageLabel : 'page';

    const routes: ILinkPage =
      itemTotal !== undefined
        ? {
            first: hasFirstPage ? updateUrlParameter(route, pageLabel, 1) : '',
            previous: hasPreviousPage
              ? updateUrlParameter(route, pageLabel, currentPage - 1)
              : '',
            next: hasNextPage
              ? updateUrlParameter(route, pageLabel, currentPage + 1)
              : '',
            last: hasLastPage ? updateUrlParameter(route, pageLabel, totalPage) : '',
            // first: hasFirstPage ? `${route}&${pageLabel}=1` : '',
            // previous: hasPreviousPage ? `${route}&${pageLabel}=${currentPage - 1}` : '',
            // next: hasNextPage ? `${route}&${pageLabel}=${currentPage + 1}` : '',
            // last: hasLastPage ? `${route}&${pageLabel}=${totalPage}` : '',
          }
        : undefined;

    const links = route ? routes : undefined;

    return {
      data,
      pagination: {
        itemFound,
        itemTotal,
        itemPerPage,
        totalPage,
        currentPage,
        linkPage: links,
      },
      // count: data.length,
      // total,
      // page: limit ? Math.floor(offset / limit) + 1 : 1,
      // pageCount: limit && total ? Math.ceil(total / limit) : 1,
    };
  }

  /**
   * Determine if need paging
   * @param parsed
   * @param options
   */
  decidePagination(parsed: ParsedRequestParams, options: CrudRequestOptions): boolean {
    return (
      options.query.alwaysPaginate ||
      ((Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
        /* istanbul ignore next */ !!this.getTake(parsed, options.query))
    );
  }

  /**
   * Get number of resources to be fetched
   * @param query
   * @param options
   */
  getTake(query: ParsedRequestParams, options: QueryOptions): number | null {
    if (query.limit) {
      return options.maxLimit
        ? query.limit <= options.maxLimit
          ? query.limit
          : options.maxLimit
        : query.limit;
    }
    /* istanbul ignore if */
    if (options.limit) {
      return options.maxLimit
        ? options.limit <= options.maxLimit
          ? options.limit
          : options.maxLimit
        : options.limit;
    }

    return options.maxLimit ? options.maxLimit : null;
  }

  /**
   * Get number of resources to be skipped
   * @param query
   * @param take
   */
  getSkip(query: ParsedRequestParams, take: number): number | null {
    return query.page && take
      ? take * (query.page - 1)
      : query.offset
      ? query.offset
      : null;
  }

  /**
   * Get primary param name from CrudOptions
   * @param options
   */
  getPrimaryParams(options: CrudRequestOptions): string[] {
    const params = objKeys(options.params).filter(
      (n) => options.params[n] && options.params[n].primary,
    );

    return params.map((p) => options.params[p].field);
  }
}
