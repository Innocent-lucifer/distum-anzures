# Distum Anzures

## Current State
BrochureModal.tsx submits leads exclusively to the ICP backend via `actor.captureLead()` and `actor.recordBrochureDownload()`. If the actor fails, it shows an error toast and nothing is saved.

## Requested Changes (Diff)

### Add
- Formspree fallback in BrochureModal: if the ICP actor call throws or actor is unavailable, automatically submit the lead data to a Formspree endpoint instead.
- The user never sees a difference -- success state shows the same PDF download and WhatsApp button regardless of which backend handled the submission.

### Modify
- `handleSubmit` in BrochureModal.tsx: wrap ICP call in try/catch, on failure silently attempt Formspree POST (name, email, phone, language fields). Only show error toast if BOTH ICP and Formspree fail.

### Remove
- Nothing removed.

## Implementation Plan
1. In BrochureModal.tsx, define a `FORMSPREE_ENDPOINT` constant (e.g. `https://formspree.io/f/YOUR_FORM_ID` -- user must replace with their own free Formspree form ID).
2. Refactor `handleSubmit` to:
   - Try ICP actor call first.
   - If actor is null or throws, fall back to `fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: JSON.stringify({name, email, phone, language}), headers: {'Content-Type': 'application/json', 'Accept': 'application/json'} })`.
   - If Formspree also fails, show error toast.
   - On any success path, set `success = true` and fire analytics.
3. Add a clear comment explaining how to get a free Formspree form ID.
