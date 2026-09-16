window.SC = window.SC || {};
SC.Audio = {
  ctx: null,
  enabled: true,
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === "suspended") this.ctx.resume();
  },
  beep(freq, dur, type, gain) {
    if (!this.enabled) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type || "triangle";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain || 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + dur);
  },
  hit(family, quality) {
    const f = family === "dink" || family === "drop" ? 220 : family === "attack" || family === "drive" ? 140 : 180;
    this.beep(f + quality * 80, 0.09, "square", 0.04 + quality * 0.03);
    this.beep(f * 2, 0.05, "triangle", 0.02);
  },
  bounce() { this.beep(90, 0.07, "sine", 0.03); },
  point(reason) {
    if (reason === "winner" || reason === "double-bounce") this.beep(420, 0.18, "sine", 0.05);
    else this.beep(160, 0.2, "sawtooth", 0.04);
  },
};
