# Change On The Fly Procedure

Use this when the user needs a fast correction before or during a meeting.

## Rule

Speed is useful only if the deck remains safe. A fast unverified change is not
ready for top management.

## Fast Path For Text-Only Changes

1. Confirm the exact replacement text.
2. Edit the source deck JSON, usually `decks/seegp-ax-monthly.json`.
3. Run:

   ```powershell
   npm run build
   npm run verify
   ```

4. Open `index.html`.
5. Jump to the changed slide with number keys `1` to `9`.
6. Check:
   - Text is correct.
   - Nothing overlaps.
   - Footer is clear.
   - Slide counter and navigation still work.
7. Present only after the visual check.

## Fast Path For New Deck Output

When the user does not want to alter the default deck:

```powershell
node engine/build.js decks/<deck>.json -o dist/<deck>.html
npm run verify
```

Then inspect `dist/<deck>.html`.

## Fast Path For A Meeting Package

To export a self-contained folder with the presentation, source deck, readme, and manifest:

```powershell
npm run package -- decks/<deck>.json -o packages/<name>
```

Then inspect `packages/<name>/presentation.html`.


## Do Not Do Live Unless Forced

Avoid these changes during a meeting:

- New slide type
- Engine CSS/layout change
- Runtime navigation change
- Large org-chart restructure
- Dense timeline redesign
- Theme creation

These need full verification and visual QA.

## Safe Fallback

If a live change fails verification, use the last verified file:

- Default: `index.html`
- Alternative: the most recently verified file in `dist/`

Do not keep trying risky edits while management is waiting.

## Micro Checklist

Before saying "ready":

- [ ] Built successfully
- [ ] `npm run verify` passed
- [ ] Changed slide inspected visually
- [ ] No footer overlap
- [ ] No cut-off text
- [ ] Correct file opened for presentation
