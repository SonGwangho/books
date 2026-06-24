---
name: Nuance Logic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 800px
  section-gap: 2.5rem
  element-gap: 1rem
  container-padding-desktop: 3rem
  container-padding-mobile: 1.25rem
  gutter: 1.5rem
---

## Brand & Style

This design system is built on a philosophy of functional minimalism, prioritizing content clarity and focused interactions. The brand personality is professional, calm, and utility-driven, designed to feel like a high-end productivity tool rather than a traditional marketing website. 

The aesthetic follows a **Modern Corporate** style with a heavy lean toward **Minimalism**. By using an app-like container on desktop, the design system maintains a tight, ergonomic focus that reduces eye strain and cognitive load. The emotional response should be one of "quiet efficiency"—where the interface recedes into the background, allowing the user's data and markdown content to take center stage.

## Colors

The palette is strictly curated to ensure the "app-like" feel. The primary accent is a soft Indigo, used exclusively for primary actions, active states, and focus indicators.

- **Primary:** Indigo (#4F46E5) for high-intent interactions.
- **Surface:** A range of Slate grays (from #F8FAFC to #64748B) provides structural hierarchy without the harshness of pure black.
- **Background:** Clean White (#FFFFFF) serves as the primary canvas for the main content container.
- **Accent/Success:** Subtle emerald or amber may be used for status indicators, but must remain subordinate to the indigo/slate core.

## Typography

The design system utilizes **Inter** for all UI and prose elements to maintain a systematic and utilitarian feel. The hierarchy is established through weight and vertical rhythm rather than drastic size changes.

- **Prose Content:** Use `body-lg` for long-form reading with a line height of 1.6x to ensure maximum legibility.
- **Headings:** Headlines use tighter letter spacing (-0.01em to -0.02em) to appear more cohesive on high-resolution screens.
- **Monospace:** For technical content within markdown, JetBrains Mono is recommended for its distinctive, readable characters.

## Layout & Spacing

The layout utilizes a **Fixed Container** model on desktop to simulate a mobile app experience. The central content area is capped at 800px to maintain optimal line lengths for reading.

- **Centered Stack:** All major components are vertically stacked within the central container. 
- **Responsive Behavior:** On desktop, the container is centered with an ambient shadow against a light gray `surface` background. On mobile, the container expands to fill the viewport width, removing external shadows and adjusting internal padding to `1.25rem`.
- **Rhythm:** A base 4px/8px grid governs all spacing. Use `section-gap` between distinct content blocks and `element-gap` for related UI groups.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** combined with **Ambient Shadows**. 

- **Level 0 (Background):** Surface color (#F1F5F9).
- **Level 1 (App Container):** White (#FFFFFF) with a very soft, diffused shadow (0px 10px 25px rgba(0,0,0,0.04)).
- **Level 2 (Interactive/Floating):** Higher elevation used for dropdowns or the primary search bar, using a sharper shadow (0px 4px 12px rgba(0,0,0,0.08)) to indicate interactivity.
- **Outlines:** Use low-contrast 1px borders (#E2E8F0) on input fields and cards to provide structure without adding visual noise.

## Shapes

The design system uses a **Rounded** shape language to soften the utilitarian nature of the typography.

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius.
- **Large Elements:** The main app container and large cards use 1.5rem (24px) for a modern, distinct "app" feel.
- **Search Bar:** The prominent search bar should use a fully rounded (pill-shaped) radius to differentiate it from content blocks.

## Components

### Search Bar
A high-visibility element at the top of the container. It should feature a 20px slate icon, "Search..." placeholder text in `body-md`, and a subtle focus ring in the primary Indigo color.

### Markdown Content
- **Headings:** Bold, primary-neutral color, with generous top-margin (2x the bottom margin) to create clear section breaks.
- **Lists:** Unordered lists use soft-gray bullets; ordered lists use Indigo-tinted numerals.
- **Code Blocks:** Rounded corners (8px), a soft gray background, and `code` typography.

### Buttons
- **Primary:** Solid Indigo background with white text. No gradients.
- **Secondary:** Ghost style with a 1px slate border and slate text.
- **Interaction:** All buttons transition background opacity (0.9) on hover.

### Cards & Lists
Cards are used to group related information within the main container. They should use a 1px border (#E2E8F0) and no shadow to keep the hierarchy flat within the already-shadowed main container.

### Inputs & Toggles
Focus states are critical; use a 2px offset ring in the primary color. Checkboxes and radio buttons should be Indigo when active to maintain visual consistency with the primary action color.