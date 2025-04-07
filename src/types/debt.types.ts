export interface Debt {
  Id: number;
  Name: string;
  NIP: string;
  Date: string;
  Value: number;
}
export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}
export const SORT_TYPES = SortDirection;
