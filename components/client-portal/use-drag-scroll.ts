"use client"

import { useRef, type MouseEvent, type PointerEvent } from "react"

type DragState = {
  ignoreClick: boolean
  moved: boolean
  pointerId: number | null
  scrollLeft: number
  startX: number
}

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const drag = useRef<DragState>({
    ignoreClick: false,
    moved: false,
    pointerId: null,
    scrollLeft: 0,
    startX: 0,
  })

  function finishDrag(event: PointerEvent<T>) {
    const element = ref.current

    if (!element || drag.current.pointerId !== event.pointerId) {
      return
    }

    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId)
    }

    delete element.dataset.dragging
    drag.current.pointerId = null

    if (drag.current.moved) {
      drag.current.ignoreClick = true
      window.setTimeout(() => {
        drag.current.ignoreClick = false
      }, 0)
    }
  }

  return {
    ref,
    onClickCapture(event: MouseEvent<T>) {
      if (!drag.current.ignoreClick) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
    },
    onPointerCancel: finishDrag,
    onPointerDown(event: PointerEvent<T>) {
      if (event.pointerType === "touch") {
        return
      }

      if (
        event.target instanceof HTMLElement &&
        event.target.closest(
          "button,a,input,select,textarea,label,[data-no-drag]"
        )
      ) {
        return
      }

      const element = ref.current

      if (!element || element.scrollWidth <= element.clientWidth) {
        return
      }

      drag.current = {
        ignoreClick: false,
        moved: false,
        pointerId: event.pointerId,
        scrollLeft: element.scrollLeft,
        startX: event.clientX,
      }

      element.dataset.dragging = "true"
      element.setPointerCapture(event.pointerId)
    },
    onPointerLeave: finishDrag,
    onPointerMove(event: PointerEvent<T>) {
      const element = ref.current

      if (!element || drag.current.pointerId !== event.pointerId) {
        return
      }

      const deltaX = event.clientX - drag.current.startX

      if (Math.abs(deltaX) > 3) {
        drag.current.moved = true
      }

      element.scrollLeft = drag.current.scrollLeft - deltaX
      event.preventDefault()
    },
    onPointerUp: finishDrag,
  }
}
