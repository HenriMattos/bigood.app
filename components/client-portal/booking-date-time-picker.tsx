"use client"

import { cn } from "@/lib/utils"

export type BookingDateItem = {
  id: string
  weekday: string
  day: string
  label: string
  disabled?: boolean
}

export type BookingTimeItem = {
  time: string
  disabled?: boolean
}

type BookingDateTimePickerProps = {
  dates: BookingDateItem[]
  times: BookingTimeItem[]
  selectedDateId: string
  selectedTime: string
  onDateChange: (id: string) => void
  onTimeChange: (time: string) => void
  className?: string
  dateTitle?: string
  timeTitle?: string
}

export function BookingDateTimePicker({
  dates,
  times,
  selectedDateId,
  selectedTime,
  onDateChange,
  onTimeChange,
  className,
  dateTitle = "Data",
  timeTitle = "Horario",
}: BookingDateTimePickerProps) {
  return (
    <section className={cn("w-full min-w-0 max-w-full space-y-5", className)}>
      <div className="w-full min-w-0 max-w-full">
        <p className="mb-2 text-sm font-medium">{dateTitle}</p>
        <div className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 [overscroll-behavior-x:contain] [scroll-padding-inline:0px] [scrollbar-width:thin]">
          <div className="flex w-max max-w-none snap-x snap-mandatory gap-2 pr-1">
            {dates.map((date) => {
              const selected = selectedDateId === date.id
              return (
                <button
                  key={date.id}
                  type="button"
                  onClick={() => onDateChange(date.id)}
                  disabled={date.disabled}
                  data-selected={selected}
                  className={cn(
                    "w-16 shrink-0 snap-start rounded-xl border px-2 py-3 text-center transition-colors",
                    "border-border bg-card text-foreground",
                    "disabled:pointer-events-none disabled:opacity-35",
                    selected && "border-primary bg-primary/10"
                  )}
                >
                  <span className="block text-[10px] uppercase text-muted-foreground">
                    {date.weekday}
                  </span>
                  <span className="block text-xl font-semibold leading-tight tabular-nums">
                    {date.day}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {date.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full">
        <p className="mb-2 text-sm font-medium">{timeTitle}</p>
        <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {times.map((slot) => {
            const selected = selectedTime === slot.time
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => onTimeChange(slot.time)}
                disabled={slot.disabled}
                data-selected={selected}
                className={cn(
                  "flex h-12 w-full min-w-0 max-w-full items-center justify-center rounded-xl border px-2 text-base font-medium tabular-nums transition-colors",
                  "disabled:pointer-events-none disabled:opacity-35",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                {slot.time}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
