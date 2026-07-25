---
name: Bharat Sewa AI Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#43474e'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#022448'
  on-primary: '#ffffff'
  primary-container: '#1e3a5f'
  on-primary-container: '#8aa4cf'
  inverse-primary: '#adc8f5'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#411800'
  on-tertiary: '#ffffff'
  tertiary-container: '#632800'
  on-tertiary-container: '#ff8031'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d486d'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  touch-target-min: 44px
---

## Brand & Style
The brand personality is rooted in reliability, accessibility, and civic empowerment. It seeks to bridge the digital divide for rural and semi-urban citizens by appearing professional yet welcoming. The emotional response should be one of "calm confidence"—reassuring the user that government services are within reach and easy to navigate.

The design style is **Corporate / Modern** with a strong emphasis on **Inclusive Design**. It avoids complex visual metaphors in favor of high-contrast elements, generous whitespace, and a clear information hierarchy. Every interface element is optimized for clarity and ease of use, ensuring that technology feels like a helpful assistant rather than a barrier.

## Colors
The palette is led by a deep Navy and a trustworthy Blue to establish institutional authority. A vibrant Saffron is used sparingly as an accent for primary calls to action or to highlight essential guidance, grounding the system in a familiar cultural context. 

Semantic colors for success, warning, and error states are chosen for high visibility and meet WCAG AA contrast standards against the white surface background. The background is a soft off-white to reduce eye strain, while the dark navy text ensures maximum readability for users with varying visual acuity.

## Typography
This design system uses **Manrope** for headings to provide a modern, friendly, and geometric touch that remains highly legible at large scales. **Inter** is utilized for all body copy and UI labels due to its exceptional performance in data-heavy and functional contexts. 

A minimum body size of 16px is enforced for mobile to ensure accessibility. Line heights are purposefully generous to assist users with reading difficulties. For headlines, mobile-specific scaling is applied to prevent awkward text wrapping on smaller devices.

## Layout & Spacing
The layout follows a **fluid grid** model. On mobile devices, a 4-column grid is used with 16px margins; on desktop, a 12-column grid is utilized with a maximum container width of 1200px to ensure line lengths remain readable.

Spacing is based on a 4px baseline grid. A "Safe Touch" rule is applied: no interactive element (buttons, links, inputs) shall be smaller than 44x44px. Vertical spacing between form fields is prioritized to prevent accidental taps and to clearly separate distinct pieces of information.

## Elevation & Depth
To maintain a professional and accessible aesthetic, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**. 

- **Surface Level 0 (Background):** Used for the main canvas, colored in the background hex.
- **Surface Level 1 (Cards):** Used for primary content containers. These use a 1px border (#E2E8F0) and a very soft, high-diffusion shadow to lift them slightly from the background.
- **Surface Level 2 (Modals/Popovers):** Used for temporary overlays. These feature a more pronounced but still neutral shadow to indicate a distinct layer of interaction.

Avoid heavy blurs or complex gradients which may cause performance issues on lower-end mobile devices common in the target demographic.

## Shapes
A **Rounded** shape language is used throughout the design system. This choice softens the "institutional" feel of government services, making the platform appear more approachable and modern. 

- **Standard Buttons/Inputs:** 0.5rem (8px) corner radius.
- **Large Cards:** 1rem (16px) corner radius.
- **Status Badges/Pills:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.
- **Voice/Microphone Buttons:** Perfectly circular to emphasize their unique function.

## Components

### Buttons & Inputs
- **Primary Button:** Navy background with white text, 48px minimum height. 
- **Voice Button:** Large circular button with Saffron background and a white microphone icon, positioned for easy thumb access.
- **Input Fields:** Large 16px text, 12px internal padding, and clear 1px borders that thicken to 2px on focus using the Primary Blue color.

### Navigation & Progress
- **Multi-step Forms:** Use a horizontal progress indicator at the top with numbered steps and text labels.
- **Bottom Navigation:** Fixed to the bottom on mobile, featuring 4-5 key icons (Home, Services, My Profile, Help) with 12px labels below icons.

### Cards & Status
- **Compact Cards:** Used for service categories; icon-led with short, bold titles.
- **Status Badges:** Small pills with low-opacity background colors (e.g., light green background with dark green text for "Success").

### Accessibility Features
- **High Contrast:** All interactive elements must maintain a 4.5:1 contrast ratio.
- **Large Targets:** Checkboxes and radio buttons are paired with large label areas that are also clickable.