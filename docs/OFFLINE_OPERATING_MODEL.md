# Creator Architecture Constraint: Self-Contained Operation

## Purpose

This file is for the project creator/architect. It explains the environment
constraint that must shape design decisions. Routine deck-editing agents should
not need to reason about this file; their job is to follow `AGENTS.md`.

The target environment may have blocked or unreliable internet access. The
project must therefore be designed so the operator agent does not need to solve
downloads, package installation, missing fonts, missing browser drivers, or
environment setup.

## Offline Contract

The final presentation file must be:

- One `.html` file
- Self-contained
- Openable through `file://`
- Free of external scripts, stylesheets, fonts, images, iframes, and network
  requests
- Presentable without a local server

The authoring project must be pre-wired so routine work:

- uses no runtime package dependencies
- requires no `npm install`
- requires no `pip install`
- uses only Node.js built-in modules for project scripts
- keeps all deck content inside the repository
- keeps all agent instructions inside the repository

## Creator Dependency Policy

`package.json` must not contain `dependencies` or `devDependencies`.

Allowed:

- Node.js already available on the machine
- Browser already available on the machine for visual QA
- Built-in Node.js modules such as `fs`, `path`, `crypto`, `child_process`

Not allowed:

- CDN links
- Remote fonts
- Package-manager installs
- Downloaded browser drivers
- Downloaded screenshots, images, or icons
- External AI models or model weights

## Operator Experience Goal

The operator agent should see a simple system:

1. Edit JSON.
2. Build.
3. Verify.
4. Inspect.
5. Deliver.

Do not make the operator agent carry architecture policy in its head. If a
dependency is needed, the creator must either build the capability into the
project with local files or reject the feature as not ready.

## Presentation-Day Safety Model

There are three safety levels:

| Level | Meaning | Use |
|---|---|---|
| Green | Verified HTML already exists | Present this file |
| Yellow | Minor deck text change needed | Edit JSON, rebuild, verify, inspect |
| Red | Engine/layout change needed | Do not do live unless there is no alternative |

For live management meetings, prefer the last Green file over an unverified new
file.

## Verification Gates

Before any deck is called ready:

1. JSON must parse.
2. Deck schema validation must pass with zero errors.
3. Density warnings must be reviewed. For management decks, treat warnings as
   blockers unless the user explicitly accepts the risk.
4. Built HTML must contain no external references.
5. Existing checked outputs must match their sources or be intentionally
   rebuilt.
6. `OFFLINE_MANIFEST.json` must be current after intentional project changes.
7. The deck must be visually inspected slide by slide.

## Hash Manifest

`OFFLINE_MANIFEST.json` records SHA-256 hashes for project files. It is not a
security system by itself; it is a drift detector. If a file changes, the
creator must decide whether the change was intentional.

Operator verification command:

```powershell
npm run verify
```

Creator manifest refresh after intentional architecture changes:

```powershell
npm run architect:manifest
npm run verify
```

## What To Do If Something Fails

| Failure | Meaning | Action |
|---|---|---|
| JSON parse error | Deck file is broken | Fix JSON first |
| Validation error | Required deck field missing or invalid | Fix the listed path |
| Validation warning | Overflow or visual risk | Split or shorten content |
| External reference found | Offline contract broken | Remove the reference |
| Hash mismatch | File changed after manifest | Confirm intentional change or investigate |
| Browser visual issue | Build passed but slide is not safe | Fix source deck or engine, rebuild, recheck |
