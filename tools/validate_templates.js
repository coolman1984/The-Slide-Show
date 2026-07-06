#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { VALID_TYPES } = require('../engine/lib/validate');
const { THEMES } = require('../engine/lib/themes');

const REGISTRY_PATH = path.join(__dirname, '..', 'templates', 'registry.json');
const SURFACE_STYLES_PATH = path.join(__dirname, '..', 'themes', 'surface-styles.json');
const EXAMPLE_ROOT = path.join(__dirname, '..', 'examples');

const errors = [];

function fail(code, pathStr, message) {
  errors.push({ code, path: pathStr, message });
}

function validate() {
  let registry;
  let surfaceStyles;
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  } catch (err) {
    fail('INVALID_JSON', 'registry', err.message);
    return { ok: false, errors };
  }
  try {
    surfaceStyles = JSON.parse(fs.readFileSync(SURFACE_STYLES_PATH, 'utf8'));
  } catch (err) {
    fail('INVALID_JSON', 'surface-styles', err.message);
    surfaceStyles = { styles: [] };
  }

  const styleById = new Map(((surfaceStyles && surfaceStyles.styles) || []).map(style => [style.styleId, style]));

  if (!registry.familyId || typeof registry.familyId !== 'string') {
    fail('MISSING_REQUIRED_FIELD', 'familyId', 'Registry must have a familyId string.');
  }
  if (!Array.isArray(registry.templates)) {
    fail('MISSING_REQUIRED_FIELD', 'templates', 'Registry must have a templates array.');
    return { ok: false, errors };
  }

  const ids = new Set();
  const templateById = new Map();
  registry.templates.forEach((tmpl, i) => {
    const p = `templates[${i}]`;
    if (!tmpl.templateId || typeof tmpl.templateId !== 'string') {
      fail('MISSING_REQUIRED_FIELD', `${p}.templateId`, 'templateId is required.');
    } else if (ids.has(tmpl.templateId)) {
      fail('DUPLICATE_TEMPLATE_ID', `${p}.templateId`, `Duplicate templateId "${tmpl.templateId}".`);
    } else {
      ids.add(tmpl.templateId);
      templateById.set(tmpl.templateId, tmpl);
    }
    if (!tmpl.slideType || typeof tmpl.slideType !== 'string') {
      fail('MISSING_REQUIRED_FIELD', `${p}.slideType`, 'slideType is required.');
    } else if (!VALID_TYPES.includes(tmpl.slideType)) {
      fail('UNKNOWN_SLIDE_TYPE', `${p}.slideType`, `Unknown runtime slide type "${tmpl.slideType}".`);
    }
    if (!Array.isArray(tmpl.requiredFields)) {
      fail('MISSING_REQUIRED_FIELD', `${p}.requiredFields`, 'requiredFields must be an array.');
    }
    if (!tmpl.densityLimits || typeof tmpl.densityLimits !== 'object' || Array.isArray(tmpl.densityLimits)) {
      fail('MISSING_REQUIRED_FIELD', `${p}.densityLimits`, 'densityLimits must be an object.');
    }
    if (Array.isArray(tmpl.allowedThemeIds)) {
      tmpl.allowedThemeIds.forEach(themeId => {
        if (!THEMES[themeId]) fail('UNKNOWN_THEME_ID', `${p}.allowedThemeIds`, `Unknown runtime theme "${themeId}".`);
      });
    }
    if (Array.isArray(tmpl.allowedSurfaceStyles)) {
      tmpl.allowedSurfaceStyles.forEach(styleId => {
        const style = styleById.get(styleId);
        if (!style) {
          fail('UNKNOWN_SURFACE_STYLE', `${p}.allowedSurfaceStyles`, `Unknown surface style "${styleId}".`);
        } else if (Array.isArray(style.allowedUse) && !style.allowedUse.includes(tmpl.slideType)) {
          fail('SURFACE_NOT_ALLOWED', `${p}.allowedSurfaceStyles`, `Surface style "${styleId}" is not allowed for ${tmpl.slideType}.`);
        }
      });
    }
  });

  validateExamples(templateById);

  return { ok: errors.length === 0, errors };
}

function checkStringLength(value, maxLength, pathStr) {
  if (typeof value === 'string' && value.length > maxLength) {
    fail('TEXT_TOO_LONG', pathStr, `Text has ${value.length} characters; maximum is ${maxLength}.`);
  }
}

function checkMaxItems(value, maxItems, pathStr) {
  if (Array.isArray(value) && value.length > maxItems) {
    fail('TOO_MANY_ITEMS', pathStr, `Array has ${value.length} items; maximum is ${maxItems}.`);
  }
}

function collectJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(dir, file));
}

function validateExamplePayload(file, templateById) {
  const before = errors.length;
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    fail('INVALID_JSON', path.relative(process.cwd(), file), err.message);
    return false;
  }
  const rel = path.relative(path.join(__dirname, '..'), file).split(path.sep).join('/');
  const template = templateById.get(payload.templateId);
  if (!template) {
    fail('UNKNOWN_TEMPLATE_ID', rel, `Unknown templateId "${payload.templateId}".`);
    return false;
  }
  for (const field of template.requiredFields || []) {
    if (!(field in payload)) fail('MISSING_REQUIRED_FIELD', `${rel}.${field}`, `Missing required field "${field}".`);
  }
  const limits = template.densityLimits || {};
  for (const [key, limit] of Object.entries(limits)) {
    if (limit.maxLength != null && key in payload) checkStringLength(payload[key], limit.maxLength, `${rel}.${key}`);
    if (limit.maxItems != null && key in payload) checkMaxItems(payload[key], limit.maxItems, `${rel}.${key}`);
  }
  if (limits.itemText && Array.isArray(payload.items)) {
    payload.items.forEach((item, i) => checkStringLength(item, limits.itemText.maxLength, `${rel}.items[${i}]`));
  }
  if (limits.cardsPerSection && Array.isArray(payload.sections)) {
    payload.sections.forEach((section, i) => checkMaxItems(section.cards, limits.cardsPerSection.maxItems, `${rel}.sections[${i}].cards`));
  }
  if (limits.cardBody && Array.isArray(payload.sections)) {
    payload.sections.forEach((section, i) => {
      (section.cards || []).forEach((card, j) => checkStringLength(card.body, limits.cardBody.maxLength, `${rel}.sections[${i}].cards[${j}].body`));
    });
  }
  if (limits.paragraphsPerCard && Array.isArray(payload.cards)) {
    payload.cards.forEach((card, i) => checkMaxItems(card.paragraphs, limits.paragraphsPerCard.maxItems, `${rel}.cards[${i}].paragraphs`));
  }
  if (limits.tilesPerRow && Array.isArray(payload.rows)) {
    payload.rows.forEach((row, i) => checkMaxItems(row.tiles, limits.tilesPerRow.maxItems, `${rel}.rows[${i}].tiles`));
  }
  if (limits.value && Array.isArray(payload.rows)) {
    payload.rows.forEach((row, i) => {
      (row.tiles || []).forEach((tile, j) => checkStringLength(String(tile.value || ''), limits.value.maxLength, `${rel}.rows[${i}].tiles[${j}].value`));
    });
  }
  return errors.length === before;
}

function validateExamples(templateById) {
  const goldenDir = path.join(EXAMPLE_ROOT, 'golden', 'family-001');
  const badDir = path.join(EXAMPLE_ROOT, 'bad', 'family-001');

  collectJsonFiles(goldenDir).forEach(file => validateExamplePayload(file, templateById));

  collectJsonFiles(badDir).forEach(file => {
    const before = errors.length;
    const passed = validateExamplePayload(file, templateById);
    const newErrors = errors.splice(before);
    if (passed) {
      const rel = path.relative(path.join(__dirname, '..'), file).split(path.sep).join('/');
      fail('BAD_EXAMPLE_PASSED', rel, 'Bad example did not trigger any template validation error.');
    }
    // Bad fixtures are expected to fail; do not make their expected errors fail the registry gate.
    void newErrors;
  });
}

function main() {
  const result = validate();
  if (result.ok) {
    console.log(`✔ templates/registry.json is valid (${JSON.parse(fs.readFileSync(REGISTRY_PATH)).templates.length} templates).`);
    process.exit(0);
  }
  console.error('✖ Template registry validation failed:');
  for (const e of result.errors) {
    console.error(`  [${e.code}] ${e.path}: ${e.message}`);
  }
  process.exit(1);
}

main();
