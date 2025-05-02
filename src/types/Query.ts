export interface JoinClause {
  table: string;
  condition: string;
}

export type ParsedQuery = {
  select: string[];
  from: {
    table: string;
    where?: string;
  };
  joins: {
    table: string;
    condition: string;
    where?: string;
  }[];
  where?: string;
};
