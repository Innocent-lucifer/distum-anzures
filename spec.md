# Distum Anzures

## Current State
Full-stack bilingual real estate landing page on ICP. WhatsApp number `5215521864824` (+52 55 2186 4824) is used in several places but not displayed visually in all WhatsApp CTA holders. Investment calculator section is always rendered inline in the page. Some benefit items in IntentSection use emoji icons. Mobile and cross-device layout is mostly optimized but can be tightened.

## Requested Changes (Diff)

### Add
- Display the formatted phone number `+52 55 2186 4824` elegantly as a visible label next to every WhatsApp CTA button/link (floating button, calculator CTAs, intent section advisor link, footer contact). The number should be clickable (wa.me link or tel: as appropriate).
- WhatsApp floating button should show the number on hover/expanded on desktop; on mobile it can be a subtle label below the button or inline.
- A `useCalculator` open/close state in `App.tsx` passed down; `InvestmentCalculatorSection` renders as a full-screen modal overlay (not inline) triggered only by: (1) clicking the navbar "Calculadora"/"Calculator" link, (2) clicking "Invertir" card in IntentSection / the "VER CALCULADORA" button inside the investment modal.

### Modify
- `App.tsx`: Remove `<InvestmentCalculatorSection />` from main page flow. Render it as a modal overlay with a close button, controlled by `calculatorOpen` state. Pass `onOpenCalculator` callback to `Navbar` and `IntentSection`.
- `Navbar.tsx`: The "Calculadora"/"Calculator" nav link should call `onOpenCalculator()` instead of scrolling to `#calculator`. Update both desktop and mobile drawer links.
- `IntentSection.tsx`: The "Invertir" card onClick opens investment modal as before. The "VER CALCULADORA DE INVERSIÓN" button inside the modal calls `onOpenCalculator()` (closes modal + opens calculator overlay).
- `InvestmentCalculatorSection.tsx`: Wrap in a full-screen modal overlay with backdrop and X close button. Scrollable on small screens. Receives `open` and `onClose` props.
- `IntentSection.tsx`: Replace emoji icons (🌆, 🏋️, 🛎️, 🔐) in living benefits with Lucide icons: `Building2`, `Dumbbell`, `BellRing`, `ShieldCheck`.
- `WhatsAppButton.tsx`: Show number `+52 55 2186 4824` as an elegant label. On desktop: animate in a pill with the number when hovering. On mobile: always visible as a small label below/beside the icon.
- All WhatsApp CTA links in calculator section: show number below button text in a subtle `+52 55 2186 4824` caption.
- Footer WhatsApp/phone area: ensure the number is prominent and linked.
- Full responsive audit: ensure no overflow, proper padding on 320px–430px phones, tablets, and desktops. Modals scroll properly. Calculator modal has max-height with overflow-y-auto.

### Remove
- The `id="investment"` anchor and the inline rendering of `InvestmentCalculatorSection` from the main page scroll flow.
- Emoji characters from IntentSection living benefits list.

## Implementation Plan
1. Update `App.tsx`: add `calculatorOpen` state, remove inline `<InvestmentCalculatorSection />`, render it as a modal, pass `onOpenCalculator` to Navbar and IntentSection.
2. Update `InvestmentCalculatorSection.tsx`: accept `open`/`onClose` props, wrap all content in a fixed full-screen overlay with backdrop + close button, add scrollable inner container.
3. Update `Navbar.tsx`: accept `onOpenCalculator` prop, replace the calculator href with an onClick handler in both desktop and mobile nav.
4. Update `IntentSection.tsx`: accept `onOpenCalculator` prop, wire it to the "VER CALCULADORA" button, replace emoji icons with Lucide icons.
5. Update `WhatsAppButton.tsx`: add hover-expanded number label pill on desktop; show number label on mobile. Keep existing animation.
6. Audit all WhatsApp CTA links (calculator section, intent section advisor) to show phone number as a subtle caption below.
7. Responsive polish: test 320px, 375px, 430px, 768px, 1280px breakpoints in code. Ensure modals scroll, no overflow, proper padding.
