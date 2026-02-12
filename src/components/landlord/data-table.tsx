export interface Column {
  key: string;
  label: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  renderCell,
  emptyMessage = "No data found.",
}: {
  columns: Column[];
  data: T[];
  renderCell?: (key: string, value: unknown, row: T) => React.ReactNode;
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-medium tracking-wide text-muted ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={(row.id as string) ?? i}
                className="border-b border-border last:border-0 hover:bg-surface/50"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {renderCell
                      ? renderCell(col.key, row[col.key], row)
                      : String(row[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
