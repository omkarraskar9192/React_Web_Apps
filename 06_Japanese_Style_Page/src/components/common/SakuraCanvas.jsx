import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

export default function SakuraCanvas() {
  const canvasRef = useRef(null)
  const enabled = useSelector((state) => state.portfolio.enablePetals)

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Number of petals - balanced for serene minimalism
    const petalCount = Math.min(Math.floor(window.innerWidth / 50), 28)
    const petals = []

    class Petal {
      constructor() {
        this.reset(true)
      }

      reset(init = false) {
        this.x = Math.random() * width
        this.y = init ? Math.random() * height : -20 - Math.random() * 40
        this.size = 7 + Math.random() * 8
        this.speedY = 0.5 + Math.random() * 0.8
        this.speedX = -0.2 + Math.random() * 0.6
        this.angle = Math.random() * Math.PI * 2
        this.angularSpeed = (Math.random() - 0.5) * 0.02
        this.flip = Math.random() * Math.PI
        this.flipSpeed = 0.01 + Math.random() * 0.02
        const alpha = 0.3 + Math.random() * 0.35
        const shades = [
          `rgba(255, 192, 203, ${alpha})`,
          `rgba(255, 218, 224, ${alpha})`,
          `rgba(244, 180, 190, ${alpha})`,
          `rgba(255, 240, 245, ${alpha + 0.1})`
        ]
        this.color = shades[Math.floor(Math.random() * shades.length)]
      }

      update() {
        this.y += this.speedY
        this.x += this.speedX + Math.sin(this.angle) * 0.4
        this.angle += this.angularSpeed
        this.flip += this.flipSpeed

        if (this.y > height + 20 || this.x > width + 40 || this.x < -40) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.scale(1, Math.cos(this.flip))

        ctx.beginPath()
        ctx.moveTo(0, -this.size)
        ctx.bezierCurveTo(
          this.size * 0.75,
          -this.size * 0.75,
          this.size * 0.85,
          this.size * 0.4,
          0,
          this.size
        )
        ctx.bezierCurveTo(
          -this.size * 0.85,
          this.size * 0.4,
          -this.size * 0.75,
          -this.size * 0.75,
          0,
          -this.size
        )

        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal())
    }

    let isVisible = true
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height)
        for (let i = 0; i < petals.length; i++) {
          petals[i].update()
          petals[i].draw()
        }
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-80"
      aria-hidden="true"
    />
  )
}
