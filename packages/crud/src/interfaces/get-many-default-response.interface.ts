import { ApiProperty } from '../crud/swagger.helper';

export interface ILinkPage {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export class LinkPageDto implements ILinkPage {
  @ApiProperty({ type: 'string' })
  first: string;

  @ApiProperty({ type: 'string' })
  previous: string;

  @ApiProperty({ type: 'string' })
  next: string;

  @ApiProperty({ type: 'string' })
  last: string;
}

export interface IPagination {
  itemFound: number;
  itemTotal: number;
  itemPerPage: number;
  totalPage: number;
  currentPage: number;
  linkPage: ILinkPage;
}

export class PaginationDto implements IPagination {
  @ApiProperty({ type: 'number' })
  itemFound: number;

  @ApiProperty({ type: 'number' })
  itemTotal: number;

  @ApiProperty({ type: 'number' })
  itemPerPage: number;

  @ApiProperty({ type: 'number' })
  totalPage: number;

  @ApiProperty({ type: 'number' })
  currentPage: number;

  linkPage: LinkPageDto;
}

export interface GetManyDefaultResponse<T> {
  data: T[];
  pagination: IPagination;
  // count: number;
  // total: number;
  // page: number;
  // pageCount: number;
}

export interface IPaginationOptionsRoutingLabels {
  limitLabel?: string;
  pageLabel?: string;
}
