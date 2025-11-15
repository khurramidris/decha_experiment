## Phase 1: PWA & Service Worker Consolidation
- Decision: Use `vite-plugin-pwa` as the single service worker strategy; remove custom SW to avoid conflicts.
- Remove manual registration and custom SW:
  - Stop calling `registerServiceWorker()` from `src/main.tsx`.
  - Deprecate `src/utils/serviceWorker.ts` (registration and background sync helpers) and `public/sw.js`.
- Use plugin auto-registration:
  - Configure `VitePWA` to auto-inject registration (`injectRegister: 'auto'`) or adopt `virtual:pwa-register` for update prompts.
- Add SPA offline navigation fallback:
  - Configure `workbox` navigate fallback for SPA routes.
- Extend runtime caching:
  - Add `same-origin` static assets, fonts (already), and any external resources in `vite.config.ts`.
- Validation:
  - Lighthouse PWA audit → check SW count, offline support, installability.
  - Verify updates auto-apply without double prompts.

## Phase 2: Decha Time Update Optimization
- Improve Earth seconds precision:
  - Update `getEarthSecondsSinceMidnight()` to include milliseconds for smooth progress.
- Optimize update cadence:
  - Replace 100ms `setInterval` in `src/hooks/useDechaTime.ts` with `requestAnimationFrame` loop or increase interval to 1000ms if smoothness not required.
  - Keep display rounded to Decha seconds while allowing smooth progress where used (e.g., progress bars).
- Add a battery saver toggle in settings to switch between `rAF` and `1s` interval.
- Validation:
  - Profile CPU usage and re-render counts; confirm smoothness improvements.

## Phase 3: Alarm Model Unification
- Make Decha the single source of truth:
  - Store alarms in Decha units; remove Earth HH:MM polling in `src/components/AlarmManager.tsx`.
- Centralize trigger logic:
  - Use `src/hooks/useNotifications.ts` for triggering; remove 30s polling effect.
  - Implement precise foreground scheduling with `setTimeout` based on Decha time.
- Repeat semantics and quiet hours:
  - Ensure repeat modes and quiet hours are applied consistently in one place.
- Validation:
  - Unit tests for once/daily/weekday/weekend/custom repeat paths; quiet-hour gating; no double triggers.

## Phase 4: Notifications Centralization
- Route notifications via SW:
  - Replace direct `new Notification(...)` with `registration.showNotification(...)` when available.
  - Consolidate into a single helper used by `useNotifications` and `useOptimizedNotifications`.
- Permission handling:
  - Request permission in one place (settings opt-in or on first need), not scattered.
- Background sync:
  - Either implement real sync logic for `alarm-sync` (queue misses, reschedule) or remove registration to avoid confusion.
- Validation:
  - Verify notifications fire in installed PWA and when tab is inactive; ensure de-duplication.

## Phase 5: Manifest Shortcuts Handling
- Parse `action` query on startup:
  - In `src/App.tsx`, read `window.location.search` and open the modal indicated by `action` (e.g., `alarm`).
- Validation:
  - Launch app via shortcut and confirm it opens the target panel.

## Phase 6: Analytics Privacy & Noise Reduction
- Add `enableAnalytics` setting in `settingsStore` and expose toggle in Settings UI.
- Initialize analytics conditionally:
  - Only initialize when enabled; gate console logs behind development flag.
- Validation:
  - Confirm no analytics calls when disabled; GA4/Clarity events when enabled.

## Phase 7: Persisted Store Versioning & Hygiene
- Add `version` and `migrate` to `persist` options in all stores (settings, alarms, stats, calendar).
- Use `partialize` to persist only durable fields; avoid transient UI state.
- Validation:
  - Simulate schema changes and confirm migrations run without data loss.

## Phase 8: Performance & Framer Motion Tuning
- Audit re-renders:
  - Use React Profiler to identify hot components; add `memo`, stable selectors.
- Reduced motion support:
  - Honor `prefers-reduced-motion` and add a toggle to minimize animations.
- Optimize animations:
  - Lower damping/transition complexity in heavy panels.
- Validation:
  - Measure FPS and CPU on low-end device; confirm improved responsiveness.

## Phase 9: Accessibility & UX Polish
- Modals:
  - Add `role="dialog"`, `aria-labelledby`, focus trap, ESC/overlay close reliability.
- Buttons and icons:
  - Add `aria-label` to icon-only buttons (e.g., close in `InstallBanner`).
- Keyboard navigation:
  - Ensure tab order and shortcuts work consistently when modals are open.
- Validation:
  - Run axe checks and manual keyboard-only pass.

## Phase 10: Testing & CI
- Add testing stack:
  - Vitest + React Testing Library for units and components; Playwright for basic e2e.
- Targeted tests:
  - Time conversions, quiet hours, notification gating, modal open/close, settings persistence/migration.
- CI pipeline:
  - GitHub Actions: type-check, lint, test, build, Lighthouse PWA audit.
- Validation:
  - Green CI with thresholds for coverage and Lighthouse scores.

## Phase 11: Icons, SEO, and Manifest Consistency
- Align icons:
  - Use `favicon.ico` consistently or switch to a single SVG strategy and reflect in VitePWA includeAssets.
- Maskable icons:
  - Confirm `purpose: 'any maskable'` works across platforms; add missing sizes if needed.
- Meta tags:
  - Validate `theme-color`, description, and Apple touch icon coverage.
- Validation:
  - Inspect manifest and icons via Chrome App Manifest panel.

## Phase 12: Rollout, Cache & Update Strategy
- Ensure clean update behavior:
  - Rely on Workbox’s precache versioning; provide an in-app toast when a new SW is installed.
- Cache busting:
  - Remove any manual cache names; rely on plugin hashing.
- Validation:
  - Confirm users receive update prompts and no stale caches remain.

## Risks & Mitigations
- SW consolidation may leave old clients controlled by the removed SW.
  - Mitigation: instruct users to reload; ensure Workbox takes control of clients promptly.
- Precise timers may be throttled by browsers in background.
  - Mitigation: prioritize SW notifications and periodic sync where supported.

## Acceptance Criteria
- Single service worker registered and controlling the app; offline works for core routes.
- Smooth time display with reduced CPU usage; battery saver toggle present.
- Alarms trigger exactly once per schedule with consistent repeat rules and quiet hours.
- Notifications delivered via SW, de-duplicated, and visible when app is installed/backgrounded.
- Manifest shortcut opens the intended modal.
- Analytics opt-out works; no logs in production.
- Persisted stores include versioning and migrations; no data loss.
- Accessibility checks pass; tests and CI are green; Lighthouse PWA ≥ 95.

If you approve, I will start with Phase 1 (service worker consolidation) and proceed in order, validating after each phase.