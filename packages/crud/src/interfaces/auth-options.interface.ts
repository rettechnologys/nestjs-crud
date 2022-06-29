import { SCondition } from '@dataui/crud-request/lib/types/request-query.types';
import { ObjectLiteral } from '@dataui/crud-util';

export interface AuthGlobalOptions {
  property?: string;
}

export interface AuthOptions {
  property?: string;
  filter?: (req: any) => SCondition | void;
  or?: (req: any) => SCondition | void;
  persist?: (req: any) => ObjectLiteral;
}
