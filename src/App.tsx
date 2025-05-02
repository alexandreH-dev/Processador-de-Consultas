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
import { optimizeQuery } from "./core/optimizer";


function App() {
  const [relAlg, setRelAlg] = useState("");
  const [relAlgOptimized, setRelAlgOptimized] = useState("");
  const [graphOptimized, setGraphOptimized] = useState<OperatorNode[]>([]);
  const [executionOptimized, setExecutionOptimized] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleQuery = (sql: string) => {
    try {
      const parsed = parseSQL(sql) as ParsedQuery;
  
      // 🛠️ FORÇA o "from" a virar objeto
      if (typeof parsed.from === "string") {
        parsed.from = { table: parsed.from };
      }
  
      const algebra = toRelationalAlgebra(parsed);
      setRelAlg(algebra);
  
      const optimized = optimizeQuery(parsed);
      const optimizedAlg = toRelationalAlgebra(optimized);
      setRelAlgOptimized(optimizedAlg);
  
      const optimizedGraph = buildOperatorGraph(optimized);
      setGraphOptimized(optimizedGraph);
      setExecutionOptimized(processQuery(optimizedGraph));
  
      setError("");
    } catch (e) {
      console.error("🔥 ERRO DETALHADO:", e);
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

        <h2 className="font-semibold mt-8">Álgebra Relacional Otimizada:</h2>
        <pre>{relAlgOptimized}</pre>

        <h2 className="font-semibold mt-4">Grafo Otimizado:</h2>
        <OperatorGraph nodes={graphOptimized} />

        <h2 className="font-semibold mt-4">Ordem de Execução (Otimizada):</h2>
        <ul>
          {executionOptimized.map((step, index) => (
            <li key={index}>
              {index + 1}. {typeof step === "object" ? JSON.stringify(step) : step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
