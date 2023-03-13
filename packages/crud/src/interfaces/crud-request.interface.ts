import { ParsedRequestParams } from '@dataui/crud-request';

import { CrudRequestOptions } from '../interfaces';

export interface CrudRequest<EXTRA = {}> {
  parsed: ParsedRequestParams<EXTRA>;
  options: CrudRequestOptions;
}
