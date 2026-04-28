import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type SimpleTableProps = {
  columns: string[]
  rows: Array<Array<React.ReactNode>>
  className?: string
}

export function SimpleTable({ columns, rows, className }: SimpleTableProps) {
  return (
    <div className={cn("min-w-0 overflow-hidden rounded-md border", className)}>
      <ScrollArea className="w-full pb-2">
        <table className="w-full min-w-[520px] text-left text-sm md:min-w-[720px]">
          <thead className="bg-muted/70 text-xs uppercase text-muted-foreground">
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
