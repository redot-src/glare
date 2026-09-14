/** Calls `onIdle` after `seconds` of no activity; `false` disables it. */
export class IdleTimer {
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private readonly seconds: number | false,
    private readonly onIdle: () => void,
  ) {}

  reset(): void {
    this.stop()
    if (this.seconds) this.timer = setTimeout(this.onIdle, this.seconds * 1000)
  }

  stop(): void {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }
}
