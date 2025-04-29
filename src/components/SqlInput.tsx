import { useState } from "react";

const wFull = {
  width: "100%"
}

export const SqlInput = ({ onQuery }: { onQuery: (sql: string) => void }) => {
  const [sql, setSql] = useState("");
  return (
    <div className="p-4">
      <textarea style={wFull} value={sql} onChange={(e) => setSql(e.target.value)} rows={6} />
      <button onClick={() => onQuery(sql)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Processar Consulta
      </button>
    </div>
  );
};
