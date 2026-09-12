---
name: cyberpunk-antigravity-hud
description: Scaffolds and styles highly immersive, retro-futuristic cyberpunk interfaces, glowing HUD elements, and anti-gravity vector systems.
keywords: [cyberpunk, neon-ui, hud, glitch-effect, vector-simulation, sci-fi-styling]
risks: safe
---

# Cyberpunk Anti-Gravity UI Skill

Use this skill when the user requests a "cyberpunk style", "netrunner terminal", "sci-fi HUD", "neon aesthetic", or elements simulating "anti-gravity metrics/vectors". This skill forces a system-first workflow leveraging strict design tokens rather than generating unstyled visual slop.

## Architecture Guidelines

1. **Design System & Tokens First**
   - Apply a baseline CRT scanline aesthetic using CSS overlays.
   - Utilize a consistent high-contrast, glowing neon color palette.
   - Use absolute positioning and fixed-grid system readouts for that classic "starfighter cockpit" or "cyberware ocular overlay" look.

2. **The Palette (Neon Vector Core)**
   - **Primary Accents:** `Cyan (#00f3ff)` and `Neon Pink (#ff0055)`.
   - **Warning/Alerts:** `Hyper Amber (#ffaa00)`.
   - **Background Baselines:** `Deep Onyx (#0a0a12)` paired with `Translucent Carbon (rgba(10, 10, 18, 0.75))`.

3. **Anti-Gravity Simulation HUD Components**
   - **Vector Matrix:** Create a grid system showing `G-Force Vector (0.0G)`, `Mass Dampening Dampeners (100%)`, and `Core Magnetic Field Output`.
   - **Status Monitors:** Include decorative real-time metrics (e.g., `Repulsor Core: STABLE`, `Z-Axis Thruster: ACTIVE`).

## Code Implementation Blueprints

### 1. Core Tailwind Configuration / CSS Variables
When generating styles, ensure these utility components or custom animations are embedded to deliver a realistic glitch/glow effect.

```css
@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 243, 255, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(0, 243, 255, 0.9)); }
}

.cyber-panel {
  border: 1px solid #00f3ff;
  background: rgba(10, 10, 18, 0.85);
  box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.15), 0 0 10px rgba(0, 243, 255, 0.1);
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
}

.glow-text-pink {
  color: #ff0055;
  text-shadow: 0 0 5px #ff0055, 0 0 10px rgba(255, 0, 85, 0.5);
}
```

### 2. The Anti-Grav HUD Component Layout
Use the layout blueprint below to generate terminal windows or landing page dashboards instantly:

```html
<div class="cyber-panel p-6 max-w-md font-mono text-xs text-[#00f3ff] uppercase tracking-wider">
  <!-- Header Header -->
  <div class="flex justify-between items-center border-b border-[#00f3ff]/30 pb-2 mb-4">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 bg-[#ff0055] animate-ping rounded-full"></span>
      <h2 class="text-sm font-bold text-white tracking-widest">AG-SYS // FLIGHT_LOG</h2>
    </div>
    <span class="text-slate-400">REV: 3.5.0</span>
  </div>

  <!-- Telemetry Metrics Grid -->
  <div class="grid grid-cols-2 gap-4 my-4">
    <div class="border border-[#00f3ff]/20 bg-black/40 p-3">
      <div class="text-[#slate-400]">GRAVITY_INDEX</div>
      <div class="text-xl font-black glow-text-pink">0.000 G</div>
    </div>
    <div class="border border-[#00f3ff]/20 bg-black/40 p-3">
      <div class="text-[#slate-400]">SUSPENSION_FIELD</div>
      <div class="text-xl font-black animate-[pulse-glow_2s_infinite]">98.4 %</div>
    </div>
  </div>

  <!-- Terminal Output Logger -->
  <div class="bg-black/60 p-3 border border-[#00f3ff]/20 text-[10px] text-emerald-400 h-24 overflow-hidden space-y-1">
    <div>[OK] INITIALIZING ARASAKA RETROTHRUSTER CORES...</div>
    <div>[OK] MASS DAMPENING FIELD ANCHORED STABLE.</div>
    <div>[WARN] LOCALIZED GRAVITATIONAL DISTORTION DETECTED.</div>
    <div class="animate-pulse">> AWAITING PILOT MANEUVER INTERCEPT_</div>
  </div>
</div>
```

## Validation & Quality Checks
- Verify layout responsiveness across viewports.
- Confirm all colors fallback nicely to default standard variables if custom tokens fail.
- Check text readability against a dark translucent baseline. Do not allow low-contrast visual drift.
