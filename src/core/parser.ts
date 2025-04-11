export function parseSQL(query: string) {
  const selectMatch = query.match(/select (.+?) from/i);
  const fromMatch = query.match(/from (.+?)( where| join|$)/i);
  const whereMatch = query.match(/where (.+?)( join|$)/i);
  const joinMatches = [...query.matchAll(/join (.+?) on (.+?)( where| join|$)/gi)];

  return {
    select: selectMatch?.[1]?.split(',').map(s => s.trim()),
    from: fromMatch?.[1]?.trim(),
    where: whereMatch?.[1]?.trim(),
    joins: joinMatches.map(m => ({ table: m[1].trim(), condition: m[2].trim() })),
  };
}
