export type OperatorType = "Selection" | "Projection" | "Join" | "Table";

export interface OperatorNode {
  id: string;
  type: OperatorType;
  label: string;
  inputs: string[]; // IDs dos nós anteriores
}
