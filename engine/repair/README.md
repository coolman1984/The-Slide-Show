# Repair Rules

This folder maps validator error codes to exact repair instructions.

## Purpose

Weak agents should not guess how to fix a validation error. Each rule tells them
exactly what action is allowed and forbids inventing facts.

## Rule format

```js
{
  instruction: 'What the agent must do.',
  mayInvent: false,
  example: 'A concrete example.'
}
```

## Covered codes

| Code | Meaning |
|---|---|
| `TEXT_TOO_LONG` | Content exceeds the density limit at the reported path. |
| `MISSING_REQUIRED_FIELD` | A required field is absent. |
| `INVALID_ENUM` | Value is not one of the allowed choices. |
| `UNKNOWN_TEMPLATE_ID` | Template ID is not registered. |
| `UNKNOWN_FIELD` | Extra field found where not allowed. |
| `TOO_SHORT` | String or array is below the minimum length. |
| `TOO_FEW_ITEMS` | Array has fewer items than required. |
| `INVALID_TYPE` | Value has the wrong JSON type. |

## Important

No repair rule may invent real names, numbers, dates, statuses, or management
messages. Use clear placeholders like `[Insert exact KPI]` when a fact is missing.
