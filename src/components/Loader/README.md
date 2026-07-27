# Premium Loader System

Three components sharing one visual language — deep emerald (`#00342B`), white, and a
restrained gold accent (`#D4AF37`). No animation libraries; every motion is a CSS
keyframe run through Tailwind's `animation` utilities.

## Files
- `FullScreenLoader.tsx` — full-page loading state (initial load, route transitions, checkout).
- `ButtonLoader.tsx` — inline spinner + a reference `LoadingButton` wrapper.
- `ProductGridSkeleton.tsx` — skeleton grid for product cards (defaults to 4).
- `LoaderShowcase.tsx` — reference page wiring all three together (not required for production).
- `tailwind.config.additions.ts` — the theme extension the components depend on.

## Setup
Merge `loaderThemeExtensions` from `tailwind.config.additions.ts` into your
`tailwind.config.ts` under `theme.extend`. That's the only setup step — everything
else is plain Tailwind classes on the components themselves.

```ts
import { loaderThemeExtensions } from './tailwind.config.additions';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      ...loaderThemeExtensions,
    },
  },
};
```

## Design notes
- **Motif consistency**: all three loaders reuse the same primitives — a rotating
  ring in muted primary, a gold accent arc/dot, and rounded-full geometry — so a
  user recognizes "the site is thinking" the same way whether it's a full page,
  a button, or a card grid.
- **Motion is quiet on purpose**: rings rotate slowly (2.6s–3.4s), the glow pulses
  gently, dots stagger by 200ms. Nothing bounces, spins fast, or overshoots —
  that restraint is what reads as premium rather than "spinner."
- **Accessibility**: each loader exposes `role="status"` / `aria-live="polite"` /
  `aria-busy="true"`, with meaningful text for screen readers (`sr-only` on the
  full-screen loader, `aria-label` on the skeleton grid). Every animated element
  has a `motion-reduce:` variant that disables or hides motion for users with
  `prefers-reduced-motion` enabled.
- **60fps-safe**: animations only touch `transform` and `opacity` — no layout-
  triggering properties — so they stay on the compositor thread.

## Usage

```tsx
// Full screen
<FullScreenLoader label="Loading" subLabel="Curating your selection" />

// Button
<LoadingButton isLoading={isSubmitting} loadingText="Placing order">
  Place order
</LoadingButton>

// Or drop ButtonLoader into your own Button component:
<button disabled={isLoading} className="... text-white">
  {isLoading && <ButtonLoader className="text-white" />}
  {isLoading ? 'Adding' : 'Add to bag'}
</button>

// Product grid skeleton
{isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={products} />}
```
