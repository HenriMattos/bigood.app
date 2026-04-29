import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type SimpleTableProps = {
  columns: string[]
  rows: Array<Array<React.ReactNode>>
  className?: string
}

export function SimpleTable({ columns, rows, className }: SimpleTableProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="grid gap-2 md:hidden">
        {rows.map((row, rowIndex) => (
          <article
            key={rowIndex}
            className="min-w-0 rounded-md border bg-card p-3"
          >
            <div className="min-w-0 text-sm font-semibold break-words">
              {row[0]}
            </div>
            <div className="mt-3 grid gap-2">
              {row.slice(1).map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${columns[cellIndex + 1]}`}
                  className="grid min-w-0 grid-cols-[6.75rem_minmax(0,1fr)] items-start gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {columns[cellIndex + 1]}
                  </span>
                  <div className="min-w-0 font-medium break-words">{cell}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <ScrollArea className="hidden w-full overflow-hidden rounded-md border pb-2 md:block">
        <table className="w-full min-w-[520px] text-left text-sm md:min-w-[720px]">
          <thead className="bg-muted/70 text-xs text-muted-foreground uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-card">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 align-middle">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}
