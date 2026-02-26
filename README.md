# rgb-split-image

A lightweight React component for adding interactive RGB split (chromatic aberration) effects to images.

- Zero dependencies
- SSR-safe
- Fully typed with strict TypeScript support
- **React only** (Works with Next.js, Remix, React,Gatsby )

> **⚠️ Epilepsy Warning:**

## try not to get a seizure while using this component.

## Install

```bash
npm install rgb-split-image
```

---

## Quick Start

```tsx
import { RGBSplitImage } from "rgb-split-image";

<RGBSplitImage
  src="/hero.jpg"
  alt="Hero"
  idleEffect="breathe"
  splitDistance={10}
/>;
```

Drop it in, pick an effect, and you’re good to go.

---

## Available Effects

| Effect        | What it does                              |
| ------------- | ----------------------------------------- |
| `none`        | No channel split everything stays aligned |
| `breathe`     | Subtle, looping sine-wave motion          |
| `followMouse` | Channels shift toward the cursor          |
| `glitch`      | Fast, random displacement each frame      |

---

## Triggers

Effects can run in different states:

| Prop         | When it runs                                    |
| ------------ | ----------------------------------------------- |
| `idleEffect` | Default state (always active unless overridden) |
| `onHover`    | While hovering the image                        |
| `onClick`    | Once per click, for `effectDuration` ms         |
| `onMount`    | Once when the component mounts                  |

**Priority order:**
`onClick` / `onMount` → `onHover` → `idleEffect`

Higher-priority effects temporarily override lower ones.

---

## Props

| Prop               | Type                | Default  | Description                                         |
| ------------------ | ------------------- | -------- | --------------------------------------------------- |
| `src`              | `string`            | -        | Image URL                                           |
| `alt`              | `string`            | -        | Alt text (required for accessibility)               |
| `idleEffect`       | `RGBEffect`         | `"none"` | Default effect                                      |
| `onHover`          | `RGBEffect`         | `"none"` | Effect on hover                                     |
| `onClick`          | `RGBEffect`         | `"none"` | Effect on click                                     |
| `onMount`          | `RGBEffect`         | -        | Effect on mount                                     |
| `splitDistance`    | `number`            | `40`     | Max pixel distance channels can separate            |
| `effectDuration`   | `number`            | `1000`   | Duration of temporary effects (ms)                  |
| `effectIntensity`  | `number`            | `1.5`    | Multiplier for temporary effects                    |
| `breatheSpeed`     | `number`            | `1.0`    | Speed of the breathe animation                      |
| `colorSpace`       | `"rgb" \| "cmyk"`   | `"rgb"`  | Color matrix mode                                   |
| `grayscale`        | `boolean`           | `false`  | Desaturates the base image                          |
| `trackWindowMouse` | `boolean`           | `false`  | Track cursor outside the image bounds               |
| `disableOnMobile`  | `boolean`           | `false`  | Disable effects on viewports ≤ 768px                |
| `as`               | `ElementType`       | `"img"`  | Render as a custom component (e.g. Next.js `Image`) |
| `onImageClick`     | `MouseEventHandler` | —        | Native click handler                                |

### Type Safety

Some props (like `breatheSpeed`, `effectDuration`, `effectIntensity`, and `trackWindowMouse`) are conditionally typed.

If you pass them without activating the relevant effect, TypeScript will throw an error. No silent misconfiguration.

---

## Examples

### Breathe by default, glitch on click

```tsx
<RGBSplitImage
  src="/photo.jpg"
  idleEffect="breathe"
  breatheSpeed={0.75}
  onClick="glitch"
  effectDuration={400}
  effectIntensity={1}
  splitDistance={20}
/>
```

### Grayscale base with color following the cursor

```tsx
<RGBSplitImage
  src="/landscape.jpg"
  idleEffect="followMouse"
  grayscale
  splitDistance={15}
/>
```

### Track mouse across the whole window

```tsx
<RGBSplitImage
  src="/grid.jpg"
  idleEffect="followMouse"
  trackWindowMouse
  splitDistance={20}
/>
```

---

## Accessibility

- Automatically respects `prefers-reduced-motion`
- Pauses when out of view (via `IntersectionObserver`)
- Optional `disableOnMobile` to reduce battery usage
- Duplicate channel layers are marked `aria-hidden="true"`

---

## License

MIT [Jafar Sabaouni](https://github.com/Jafar-Sabaouni)
