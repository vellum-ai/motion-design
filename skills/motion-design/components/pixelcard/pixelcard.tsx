// Set these props to match the Originkit preview:
//   overrides={{}}
//   __curationVersion={1}
import { useEffect, useRef, type CSSProperties } from "react"
class Pixel {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    color: string
    speed: number
    size: number
    sizeStep: number
    minSize: number
    maxSizeInteger: number
    maxSize: number
    delay: number
    counter: number
    counterStep: number
    isIdle: boolean
    isReverse: boolean
    isShimmer: boolean
    growStart: number | null
    shrinkStart: number | null
    shrinkFrom: number

    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: string,
        speed: number,
        delay: number,
        maxPx: number
    ) {
        this.width = canvas.width
        this.height = canvas.height
        this.ctx = context
        this.x = x
        this.y = y
        this.color = color
        this.speed = this.getRandomValue(0.1, 0.9) * speed
        this.size = 0
        // Scale the original 0.5–2px range by the chosen particle size.
        const factor = maxPx / 2
        this.sizeStep = Math.random() * 0.4 * factor
        this.minSize = 0.5 * factor
        this.maxSizeInteger = maxPx
        this.maxSize = this.getRandomValue(this.minSize, maxPx)
        this.delay = delay
        this.counter = 0
        this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01
        this.isIdle = false
        this.isReverse = false
        this.isShimmer = false
        this.growStart = null
        this.shrinkStart = null
        this.shrinkFrom = 0
    }

    getRandomValue(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    draw() {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(
            this.x + centerOffset,
            this.y + centerOffset,
            this.size,
            this.size
        )
    }

    // Grow-in by incrementing size (per the reference implementation). The
    // per-pixel `delay` staggers the start so the sweep order is preserved.
    // Because it advances from the pixel's CURRENT size, a cancelled + restarted
    // loop simply resumes — it never jumps back to 0, so the reveal is single.
    appear() {
        this.isIdle = false
        if (this.counter <= this.delay) {
            this.counter += this.counterStep
            return
        }
        if (this.size >= this.maxSize) {
            this.isShimmer = true
        }
        if (this.isShimmer) {
            this.shimmer()
        } else {
            this.size += this.sizeStep
        }
        this.draw()
    }

    disappear() {
        this.isShimmer = false
        this.counter = 0
        if (this.size <= 0) {
            this.isIdle = true
            return
        }
        this.size -= 0.1
        this.draw()
    }

    shimmer() {
        if (this.size >= this.maxSize) {
            this.isReverse = true
        } else if (this.size <= this.minSize) {
            this.isReverse = false
        }
        if (this.isReverse) {
            this.size -= this.speed
        } else {
            this.size += this.speed
        }
    }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
    const min = 0
    const max = 100
    // Doubled from 0.001 — speed 100 is now 2× the old max; all speeds scale up.
    const throttle = 0.002

    if (value <= min || reducedMotion) {
        return min
    } else if (value >= max) {
        return max * throttle
    } else {
        return value * throttle
    }
}

const DEFAULT_COLORS = [
    "rgba(255, 255, 255, 1)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.6)",
]

interface LabelGroup {
    text?: string
    color?: string
    font?: CSSProperties
}

type AppearFrom = "middle" | "top" | "bottom" | "left" | "right"
type Trigger = "default" | "hover" | "enter"
type EnterPosition = "above" | "middle" | "below"

interface PixelCardProps {
    colors?: string[]
    gap?: number
    pixelSize?: number
    speed?: number
    appearFrom?: AppearFrom
    trigger?: Trigger
    enterPosition?: EnterPosition
    enterReplay?: "yes" | "no"
    backgroundColor?: string
    padding?: number
    borderColor?: string
    borderWidth?: number
    radius?: number
    showLabel?: boolean
    label?: LabelGroup
    style?: CSSProperties
}

/**
 * Pixel Card
 *
 * A canvas grid of pixels that grows in on hover and shimmers, then shrinks out
 * on leave. Based on the React Bits PixelCard by David Haz. The pixel palette is
 * a user color array, evenly assigned across the pixels.
 *
 * @framerIntrinsicWidth 300
 * @framerIntrinsicHeight 400
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function PixelCard(props: PixelCardProps) {
    const {
        colors = DEFAULT_COLORS,
        gap = 6,
        pixelSize = 2,
        speed = 80,
        appearFrom = "middle",
        trigger = "default",
        enterPosition = "above",
        enterReplay = "no",
        backgroundColor = "#000000",
        padding = 0,
        borderColor = "#27272a",
        borderWidth = 1,
        radius = 25,
        showLabel = false,
        label,
        style,
    } = props

    const labelCfg: LabelGroup = { text: "", color: "#ffffff", ...label }

    // Freeze to a single drawn frame ONLY on true static renders (export /
    // thumbnail). On the Framer canvas we auto-run the appear+shimmer loop so
    // the pixels blink per the selected speed without needing a hover; Preview
    // keeps the hover trigger.
    const renderTarget = RenderTarget.current()
    const isExport =
        renderTarget === RenderTarget.export ||
        renderTarget === RenderTarget.thumbnail
    const isCanvas = renderTarget === RenderTarget.canvas
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pixelsRef = useRef<Pixel[]>([])
    const animationRef = useRef<ReturnType<
        typeof requestAnimationFrame
    > | null>(null)
    // Enter mode: ensures the reveal plays once per entry into view.
    const hasPlayedRef = useRef(false)
    // True once the auto grow-in reveal has started. First reveal grows (so the
    // particles visibly appear, respecting Appear From); after that any rebuild
    // snaps directly to shimmer so the grow never plays a second time.
    const revealedRef = useRef(false)
    // Last measured canvas size — used to detect real resizes.
    const sizeRef = useRef({ w: 0, h: 0 })
    // Signature of the props that shape the grid. A real change forces a rebuild
    // (fresh grow-in); an identical value means the effect re-ran for another
    // reason (StrictMode double-invoke / Fast Refresh), so we resume the same
    // pixels instead of rebuilding — that's what keeps the grow-in single.
    const propsKeyRef = useRef("")
    const timePreviousRef = useRef(
        typeof performance !== "undefined" ? performance.now() : 0
    )
    const reducedMotion = useRef(
        typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ).current

    const finalGap = gap
    const finalSpeed = speed
    const finalColors = colors && colors.length > 0 ? colors : DEFAULT_COLORS

    // Returns true when it actually (re)built the grid, false when it skipped
    // because the size was unchanged. Lets the caller reveal only on a first
    // build or a real resize (not on the ResizeObserver's synchronous first
    // fire, which otherwise restarts the grow-from-center a second time).
    const initPixels = (force = false): boolean => {
        if (!containerRef.current || !canvasRef.current) return false

        // Measure via the layout box (clientWidth) first; getBoundingClientRect
        // can read 0 on the Framer canvas at setup, leaving an empty grid. Fall
        // back to the container so the card always fills the frame.
        const el = canvasRef.current
        const container = containerRef.current
        const width = Math.floor(
            el.clientWidth ||
                el.getBoundingClientRect().width ||
                container.clientWidth ||
                0
        )
        const height = Math.floor(
            el.clientHeight ||
                el.getBoundingClientRect().height ||
                container.clientHeight ||
                0
        )
        const ctx = canvasRef.current.getContext("2d")

        const changed =
            sizeRef.current.w !== width || sizeRef.current.h !== height
        // Size unchanged and the grid already exists → do NOT rebuild (unless
        // forced by a prop change). Rebuilding resets every pixel to size 0, and
        // a running appear loop would then regrow them from center, causing a
        // visible second appearance. The ResizeObserver's spurious same-size
        // fire hits this; real prop changes pass force=true.
        if (!force && !changed && pixelsRef.current.length > 0) return false
        sizeRef.current = { w: width, h: height }

        canvasRef.current.width = width
        canvasRef.current.height = height
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`

        const colorsArray = finalColors
        const step = Math.max(1, parseInt(finalGap.toString(), 10))
        const pxs: Pixel[] = []
        let idx = 0
        for (let x = 0; x < width; x += step) {
            for (let y = 0; y < height; y += step) {
                // Evenly assign the palette across pixels (cycle by index).
                const c = colorsArray[idx % colorsArray.length]
                idx++

                let delay: number
                if (reducedMotion) {
                    delay = 0
                } else if (appearFrom === "top") {
                    delay = y
                } else if (appearFrom === "bottom") {
                    delay = height - y
                } else if (appearFrom === "left") {
                    delay = x
                } else if (appearFrom === "right") {
                    delay = width - x
                } else {
                    const dx = x - width / 2
                    const dy = y - height / 2
                    delay = Math.sqrt(dx * dx + dy * dy)
                }
                if (!ctx) return false
                pxs.push(
                    new Pixel(
                        canvasRef.current,
                        ctx,
                        x,
                        y,
                        c,
                        getEffectiveSpeed(finalSpeed, reducedMotion),
                        delay,
                        Math.max(0.1, pixelSize)
                    )
                )
            }
        }
        pixelsRef.current = pxs
        return true
    }

    const drawStaticFrame = () => {
        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx || !canvasRef.current) return
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        for (const pixel of pixelsRef.current) {
            pixel.size = pixel.maxSize
            pixel.draw()
        }
    }

    const doAnimate = (fnName: keyof Pixel) => {
        animationRef.current = requestAnimationFrame(() => doAnimate(fnName))
        const timeNow = performance.now()
        const timePassed = timeNow - timePreviousRef.current
        const timeInterval = 1000 / 60

        if (timePassed < timeInterval) return
        timePreviousRef.current = timeNow - (timePassed % timeInterval)

        const ctx = canvasRef.current?.getContext("2d")
        if (!ctx || !canvasRef.current) return

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        let allIdle = true
        for (let i = 0; i < pixelsRef.current.length; i++) {
            const pixel = pixelsRef.current[i]
            // @ts-ignore
            pixel[fnName]()
            if (!pixel.isIdle) {
                allIdle = false
            }
        }
        if (allIdle) {
            cancelAnimationFrame(animationRef.current as number)
        }
    }

    const handleAnimation = (name: keyof Pixel) => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current)
        }
        animationRef.current = requestAnimationFrame(() => doAnimate(name))
    }

    const onMouseEnter = () => handleAnimation("appear")
    const onMouseLeave = () => handleAnimation("disappear")

    // Snap every pixel straight to its full/shimmer state (skip the grow-in),
    // paint that state THIS tick (so there's no blank-canvas frame that reads as
    // a second appearance), then run the loop so they shimmer. Deterministic and
    // idempotent: a StrictMode / Fast-Refresh re-run or a resize rebuild just
    // re-snaps to the same state — the pixels directly appear already moving and
    // can never grow in twice.
    const snapToShimmer = () => {
        for (const pixel of pixelsRef.current) {
            pixel.size = pixel.maxSize
            pixel.isShimmer = true
            pixel.isIdle = false
            pixel.growStart = null
            pixel.shrinkStart = null
            pixel.counter = pixel.delay + pixel.counterStep
        }
        // Paint immediately so the freshly (re)built grid never flashes blank.
        const ctx = canvasRef.current?.getContext("2d")
        if (ctx && canvasRef.current) {
            ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            )
            for (const pixel of pixelsRef.current) pixel.draw()
        }
        handleAnimation("appear")
    }

    // Export/thumbnail → one static frame. Otherwise the auto triggers (canvas,
    // or "default" in preview) reveal the pixels:
    //   • first reveal → grow-in from the selected Appear From position, then
    //     shimmer. Plays exactly once.
    //   • StrictMode / Fast-Refresh re-run with no rebuild → resume that same
    //     grow (pixels are preserved), so it never restarts.
    //   • a later real rebuild (resize / prop change), once already revealed →
    //     snap straight to shimmer (immediate draw, no blank flash, no regrow).
    // `built` = whether initPixels just (re)built the grid this call.
    // "hover"/"enter" are driven by their own handlers/observer.
    const present = (built: boolean) => {
        if (isExport) {
            drawStaticFrame()
            return
        }
        const auto = isCanvas || trigger === "default"
        if (!auto) return
        // Nothing to reveal yet — a 0-size mount builds an empty grid. Do NOT
        // consume the one-time reveal here, or the real grid (arriving via the
        // resize) would only snap in instead of growing.
        if (pixelsRef.current.length === 0) return
        if (!revealedRef.current) {
            revealedRef.current = true
            handleAnimation("appear")
        } else if (built) {
            snapToShimmer()
        } else {
            handleAnimation("appear")
        }
    }

    useEffect(() => {
        // Only a genuine prop change forces a rebuild (fresh grow-in). When the
        // effect re-runs with the same signature — StrictMode's setup/cleanup/
        // setup, or Fast Refresh — we skip the rebuild so present() resumes the
        // same pixels instead of restarting the grow (which looked like a double
        // appear / instant snap in the code preview).
        const propsKey = `${finalGap}|${finalSpeed}|${pixelSize}|${appearFrom}|${JSON.stringify(
            finalColors
        )}|${trigger}`
        const propsChanged = propsKeyRef.current !== propsKey
        propsKeyRef.current = propsKey

        const built = initPixels(propsChanged)
        present(built)
        // Resize → rebuild only on a real size change; the observer's synchronous
        // first fire reports the same size and is skipped. After the one reveal,
        // a rebuild re-shows the shimmer directly (snap) without a second grow.
        const observer = new ResizeObserver(() => {
            if (initPixels()) present(true)
        })
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }
        return () => {
            observer.disconnect()
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        finalGap,
        finalSpeed,
        pixelSize,
        JSON.stringify(finalColors),
        appearFrom,
        trigger,
        isExport,
        isCanvas,
    ])

    // Enter mode: reveal the pixels when the card scrolls into view. Replays on
    // re-entry when Replay is on. Skipped on canvas/export (present() handles
    // those). Mirrors the PixelateImage enter trigger.
    useEffect(() => {
        if (trigger !== "enter" || isExport || isCanvas) return
        const el = containerRef.current
        if (!el) return
        const threshold =
            enterPosition === "middle" ? 0.5 : enterPosition === "below" ? 1 : 0
        hasPlayedRef.current = false
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (!hasPlayedRef.current) {
                            hasPlayedRef.current = true
                            handleAnimation("appear")
                        }
                    } else if (enterReplay === "yes") {
                        hasPlayedRef.current = false
                        handleAnimation("disappear")
                    }
                })
            },
            { threshold }
        )
        observer.observe(el)
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, enterPosition, enterReplay, isExport, isCanvas])

    const rootStyle: CSSProperties = {
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 80,
        minHeight: 80,
        overflow: "hidden",
        boxSizing: "border-box",
        padding,
        background: backgroundColor,
        display: "grid",
        placeItems: "center",
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: radius,
        isolation: "isolate",
        userSelect: "none",
        transition: "border-color 0.2s cubic-bezier(0.5,1,0.89,1)",
        ...(style || {}),
    }

    return (
        <div
            ref={containerRef}
            style={rootStyle}
            onMouseEnter={
                isExport || isCanvas || trigger !== "hover"
                    ? undefined
                    : onMouseEnter
            }
            onMouseLeave={
                isExport || isCanvas || trigger !== "hover"
                    ? undefined
                    : onMouseLeave
            }
            tabIndex={-1}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    gridArea: "1 / 1",
                }}
            />
            {showLabel && labelCfg.text ? (
                <div
                    style={{
                        gridArea: "1 / 1",
                        position: "relative",
                        zIndex: 1,
                        display: "grid",
                        placeItems: "center",
                        pointerEvents: "none",
                    }}
                >
                    <span
                        style={{
                            color: labelCfg.color,
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                            ...(labelCfg.font || {}),
                        }}
                    >
                        {labelCfg.text}
                    </span>
                </div>
            ) : null}
        </div>
    )
}
