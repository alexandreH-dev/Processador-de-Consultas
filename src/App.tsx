import { useState } from "react";
import { SqlInput } from "./components/SqlInput";
import { parseSQL } from "./core/parser";
import { toRelationalAlgebra } from "./core/relationalAlgebra";
import { ParsedQuery } from "./types/Query";

function App() {
  const [relAlg, setRelAlg] = useState("");

  const handleQuery = (sql: string) => {
    const parsed = parseSQL(sql) as ParsedQuery;
    const algebra = toRelationalAlgebra(parsed);
    setRelAlg(algebra);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px'
      }}
    >
      <h1 className="text-xl font-bold p-4">Processador de Consultas SQL</h1>
      <SqlInput onQuery={handleQuery} />
      <div className="p-4">
        <h2 className="font-semibold">Álgebra Relacional:</h2>
        <pre>{relAlg}</pre>
      </div>
    </div>
  );
}

export default App;
