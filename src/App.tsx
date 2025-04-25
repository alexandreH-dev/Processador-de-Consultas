import { useState } from "react";
import { SqlInput } from "./components/SqlInput";
import { parseSQL } from "./core/parser";
import { toRelationalAlgebra } from "./core/relationalAlgebra";
import { ParsedQuery } from "./types/Query";
import { ErrorModal } from "./components/ErrorModal";
import { OperatorNode } from "./types/Operator";
import { buildOperatorGraph } from "./core/operatorGraph";
import { processQuery } from "./core/queryProcessor";
import { OperatorGraph } from "./components/OperatorGraph";

function App() {
  const [relAlg, setRelAlg] = useState("");
  const [error, setError] = useState("");
  const [graph, setGraph] = useState<OperatorNode[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);

  const handleQuery = (sql: string) => {
    try {
      const parsed = parseSQL(sql) as ParsedQuery;
      const algebra = toRelationalAlgebra(parsed);
      setRelAlg(algebra);

      const graphBuilt = buildOperatorGraph(parsed);
      setGraph(graphBuilt);

      const execution = processQuery(graphBuilt);
      setExecutionOrder(execution);

      setError("");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px',
        height: '100vh'
      }}
    >
      <h1 className="text-xl font-bold p-4">Processador de Consultas SQL</h1>
      <SqlInput onQuery={handleQuery} />
      {error && <ErrorModal message={error} onClose={() => setError("")} />}
      <div className="p-4">
        <h2 className="font-semibold">Álgebra Relacional:</h2>
        <pre>{relAlg}</pre>

        <h2 className="font-semibold mt-4">Grafo de Operadores:</h2>
        <OperatorGraph nodes={graph} />

        <h2 className="font-semibold mt-4">Ordem de Execução:</h2>
        <ul>
          {executionOrder.map((step, index) => (
            <li key={index}>{index + 1}. {step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
