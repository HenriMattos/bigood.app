"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/45 backdrop-blur-sm dark:bg-black/70",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const [expanded, setExpanded] = React.useState(false)
  const [dragY, setDragY] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const startYRef = React.useRef<number | null>(null)
  const movedRef = React.useRef(false)

  const sheetStyle = {
    ...style,
    "--dialog-sheet-height": expanded
      ? "calc(100dvh - 0.5rem)"
      : "min(84dvh, calc(100dvh - 1rem))",
    "--dialog-drag-y": `${dragY}px`,
  } as React.CSSProperties

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return
    }

    startYRef.current = event.clientY
    movedRef.current = false
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (startYRef.current === null) {
      return
    }

    const nextDragY = event.clientY - startYRef.current
    movedRef.current = Math.abs(nextDragY) > 8
    setDragY(Math.max(-96, Math.min(nextDragY, 112)))
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (startYRef.current === null) {
      return
    }

    const finalDragY = event.clientY - startYRef.current

    if (finalDragY < -44) {
      setExpanded(true)
    }

    if (finalDragY > 44) {
      setExpanded(false)
    }

    startYRef.current = null
    setDragY(0)
    setDragging(false)
  }

  function handleHandleClick() {
    if (movedRef.current) {
      movedRef.current = false
      return
    }

    setExpanded((current) => !current)
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-expanded={expanded}
        data-dragging={dragging}
        className={cn(
          "fixed inset-x-0 top-auto bottom-0 z-50 flex h-[var(--dialog-sheet-height)] max-h-[calc(100dvh-0.5rem)] w-full translate-x-0 translate-y-[var(--dialog-drag-y)] flex-col overflow-hidden rounded-t-2xl rounded-b-none border border-x-0 border-b-0 bg-background shadow-xl transition-[height,transform] duration-200 ease-out outline-none data-[dragging=true]:transition-none sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border [&_[data-slot=scroll-area]]:min-h-0 [&_[data-slot=scroll-area]]:flex-1 [&>div:not([data-slot])]:min-h-0 [&>div:not([data-slot])]:flex-1 [&>div:not([data-slot])]:overflow-y-auto [&>form]:min-h-0 [&>form]:flex-1",
          className
        )}
        style={sheetStyle}
        {...props}
      >
        <button
          type="button"
          aria-label={expanded ? "Recolher modal" : "Expandir modal"}
          aria-expanded={expanded}
          data-slot="dialog-drag-handle"
          className="mx-auto flex h-5 w-28 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing sm:hidden"
          onClick={handleHandleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span className="h-1 w-14 rounded-full bg-border" />
        </button>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex shrink-0 flex-col gap-1 border-b p-4", className)}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("min-h-0 flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 border-t bg-background/95 p-4 sm:flex-row sm:justify-end sm:bg-background [&_[data-slot=button]]:w-full sm:[&_[data-slot=button]]:w-auto",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export {
  DialogBody,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
}
