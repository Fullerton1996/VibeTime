import { useRef, useState } from "react"
import confetti from "canvas-confetti"
import { Plus, X, Shuffle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function fireConfetti() {
  const end = Date.now() + 800
  const colors = ["#a855f7", "#ec4899", "#3b82f6", "#f59e0b", "#10b981"]
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors, startVelocity: 45 })
}

export default function App() {
  const [draft, setDraft] = useState("")
  const [options, setOptions] = useState<string[]>(["Pizza", "Sushi", "Tacos"])
  const [result, setResult] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [teaser, setTeaser] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addOption = () => {
    const v = draft.trim()
    if (!v) return
    setOptions((o) => [...o, v])
    setDraft("")
    inputRef.current?.focus()
  }

  const removeOption = (i: number) => setOptions((o) => o.filter((_, idx) => idx !== i))

  const pick = () => {
    if (options.length < 2 || spinning) return
    setSpinning(true)
    setResult(null)
    const duration = 1600
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      setTeaser(options[Math.floor(Math.random() * options.length)])
      if (elapsed < duration) {
        setTimeout(tick, 60 + (elapsed / duration) * 140)
      } else {
        const winner = options[Math.floor(Math.random() * options.length)]
        setTeaser(null)
        setResult(winner)
        setSpinning(false)
        fireConfetti()
      }
    }
    tick()
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Randomizer</CardTitle>
          </div>
          <CardDescription>Add options, then let fate decide.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addOption()
                }
              }}
              placeholder="Add an option…"
              disabled={spinning}
            />
            <Button onClick={addOption} disabled={spinning || !draft.trim()} size="icon" aria-label="Add">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
            {options.length === 0 && (
              <p className="text-sm text-muted-foreground">No options yet — add at least two.</p>
            )}
            {options.map((opt, i) => (
              <Badge key={`${opt}-${i}`} className="pr-1">
                <span>{opt}</span>
                <button
                  onClick={() => removeOption(i)}
                  disabled={spinning}
                  className="ml-1 rounded-full p-0.5 hover:bg-background/60 transition-colors"
                  aria-label={`Remove ${opt}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <Button onClick={pick} disabled={options.length < 2 || spinning} size="lg" className="w-full">
            <Shuffle className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`} />
            {spinning ? "Choosing…" : "Randomize"}
          </Button>

          <div className="rounded-lg border bg-muted/40 p-6 text-center min-h-[6.5rem] flex flex-col items-center justify-center">
            {result ? (
              <>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">The winner is</p>
                <p className="text-3xl font-bold text-primary">{result}</p>
              </>
            ) : spinning ? (
              <p className="text-2xl font-semibold text-muted-foreground">{teaser ?? "…"}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Your result will appear here.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
