'use strict';

/*
 * REPAIR RULE REGISTRY
 * Maps validator error codes to exact repair instructions.
 * None of these instructions allow the agent to invent missing facts.
 */

const REPAIR_RULES = {
  TEXT_TOO_LONG: {
    instruction: 'Shorten the text at the reported path. Preserve meaning. Do not invent new facts.',
    mayInvent: false,
    example: 'Use the rewrite-card-body prompt.',
  },
  MISSING_REQUIRED_FIELD: {
    instruction: 'Add the missing field. If the value is unknown, use an explicit placeholder such as [Insert ...]. Do not guess names, numbers, dates, or statuses.',
    mayInvent: false,
    example: 'If leader.name is missing, return "[Insert leader name]" rather than a real name.',
  },
  INVALID_ENUM: {
    instruction: 'Replace the value with one of the allowed values listed in the error message.',
    mayInvent: false,
    example: 'Use "completed", "inprogress", or "planning" for a timeline status.',
  },
  UNKNOWN_TEMPLATE_ID: {
    instruction: 'Choose a templateId that exists in templates/registry.json. If no template fits, stop and report the mismatch.',
    mayInvent: false,
    example: 'Use "family-001-title" for a cover slide.',
  },
  UNKNOWN_FIELD: {
    instruction: 'Remove the unexpected field, or move it to the correct location if you recognize it.',
    mayInvent: false,
    example: 'A top-level "extraField" in SlideSpec should be deleted.',
  },
  TOO_SHORT: {
    instruction: 'Provide a value that meets the minimum length required by the schema.',
    mayInvent: false,
    example: 'A lang field must have at least 2 characters.',
  },
  TOO_FEW_ITEMS: {
    instruction: 'Add the required number of items, or remove the empty collection if it is optional.',
    mayInvent: false,
    example: 'A SlideSpec slides array must contain at least one slide.',
  },
  INVALID_TYPE: {
    instruction: 'Replace the value with one of the allowed JSON types for that field.',
    mayInvent: false,
    example: 'A heading must be a string, not a number.',
  },
};

function getRule(code) {
  return REPAIR_RULES[code] || null;
}

module.exports = { REPAIR_RULES, getRule };
