# Sprint OS DESIGN.md

> Adapted from VoltAgent / awesome-design-md for AX x HR Sprint OS.

## Design Intent

Sprint OS should feel like a focused **operator cockpit** for running a 3-week Humanistic Practice Lab cohort, not like a generic SaaS dashboard.

The visual metaphor is:

```text
Dark operating room + emerald signal system + warm humanistic text layer
```

The UI should help the founder and participants instantly answer:

```text
Where are we?
What has happened?
What is blocked?
What should I do next?
```

## Reference

Source inspiration:

```text
https://github.com/VoltAgent/awesome-design-md
VoltAgent design system: void-black canvas, emerald accent, terminal-native developer dashboard
```

## Palette

```css
--bg: #050507;              /* abyss black */
--surface: #101010;         /* carbon surface */
--surface-soft: #151513;    /* raised cards */
--surface-glow: #18211d;    /* green-tinted panels */
--ink: #f2f2f2;             /* primary text */
--muted: #b8b3b0;           /* secondary text */
--subtle: #8b949e;          /* tertiary text */
--line: #3d3a39;            /* warm charcoal border */
--line-strong: #5b5652;     /* stronger separator */
--accent: #00d992;          /* emerald signal */
--accent-2: #2fd6a1;        /* readable mint */
--accent-soft: rgba(0, 217, 146, 0.12);
--green: #00d992;
--amber: #ffba00;
--red: #fb565b;
```

## Typography

- Use system-ui / Inter for readable Korean UI.
- Use JetBrains Mono / monospace for overlines, state labels, technical chips, stage IDs.
- Headings should be tight and compressed.
- Uppercase labels should use wide tracking.

## Components

### App Shell

- Full dark canvas.
- Sidebar is slightly raised carbon surface.
- Main workspace uses subtle radial glow backgrounds.

### Sidebar

- Current view mode should be explicit.
- Active nav item uses emerald border/glow.
- Public/admin distinction is clear but not represented as real auth.

### Cards

- Carbon surface with warm charcoal border.
- Use emerald border only for active/high-signal states.
- Do not use large light surfaces.

### Dashboard

- Hero should feel like a command-center status panel.
- Current stage and next action must be visually dominant.
- Progress roadmap should read as an operating sequence.

### Public View

- Public view should be calmer and safer.
- Hide P-0 and private facilitator notes.
- Use participant-facing wording: "오늘 할 일", "내 문제", "다음 액션".

### Admin View

- Admin view should feel like an operator console.
- Show full ticket counts, private menus, raw data, analysis, reflection, method accumulation.

## Do

- Use black/carbon surfaces.
- Use emerald as a signal, not as a large fill.
- Use borders for hierarchy.
- Keep content scannable.
- Make next actions obvious.
- Keep public/admin limitations visible.

## Don't

- Do not use bright beige/white app backgrounds.
- Do not make every card glow.
- Do not imply real authorization until auth exists.
- Do not expose facilitator diagnosis in public mode.
- Do not let the participant-facing screen feel like a sales funnel.
