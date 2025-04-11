export interface JoinClause {
  table: string;
  condition: string;
}

export interface ParsedQuery {
  select: string[];
  from: string;
  where?: string;
  joins: JoinClause[];
}
