#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { THEMES } = require('../engine/lib/themes');

const SCHEMA_PATH = path.join(__dirname, '..', 'schemas', 'slide-spec.schema.json');
const TEMPLATE_REGISTRY_PATH = path.join(__dirname, '..', 'templates', 'registry.json');
const THEME_CATALOG_PATH = path.join(__dirname, '..', 'themes', 'catalog.json');

const errors = [];

function addError(code, pathStr, message) {
  errors.push({ code, path: pathStr, message });
}

function resolveRef(schema, ref) {
  if (!ref.startsWith('#/')) return null;
  const parts = ref.slice(2).split('/');
  let node = schema;
  for (const p of parts) {
    if (node == null) return null;
    node = node[p];
  }
  return node;
}

function checkType(value, expected) {
  if (expected === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (expected === 'array') return Array.isArray(value);
  return typeof value === expected;
}

function validateNode(value, subSchema, schemaRoot, pathStr) {
  if (subSchema == null) return;
  if (subSchema.$ref) {
    const target = resolveRef(schemaRoot, subSchema.$ref);
    if (!target) {
      addError('UNKNOWN_REF', pathStr, `Could not resolve schema reference ${subSchema.$ref}`);
      return;
    }
    return validateNode(value, target, schemaRoot, pathStr);
  }

  if (subSchema.type && !checkType(value, subSchema.type)) {
    addError('INVALID_TYPE', pathStr, `Expected ${subSchema.type}, got ${Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value}.`);
    return;
  }

  if (subSchema.enum && !subSchema.enum.includes(value)) {
    addError('INVALID_ENUM', pathStr, `Value must be one of: ${subSchema.enum.join(', ')}.`);
  }

  if (subSchema.type === 'string' && subSchema.minLength != null && value.length < subSchema.minLength) {
    addError('TOO_SHORT', pathStr, `String must be at least ${subSchema.minLength} characters.`);
  }

  if (subSchema.type === 'number' && subSchema.minimum != null && value < subSchema.minimum) {
    addError('TOO_SMALL', pathStr, `Number must be at least ${subSchema.minimum}.`);
  }

  if (subSchema.type === 'array') {
    if (subSchema.minItems != null && value.length < subSchema.minItems) {
      addError('TOO_FEW_ITEMS', pathStr, `Array must contain at least ${subSchema.minItems} item(s).`);
    }
    if (subSchema.items) {
      value.forEach((item, i) => validateNode(item, subSchema.items, schemaRoot, `${pathStr}[${i}]`));
    }
  }

  if (subSchema.type === 'object') {
    if (subSchema.required) {
      for (const key of subSchema.required) {
        if (!(key in value)) {
          addError('MISSING_REQUIRED_FIELD', pathStr ? `${pathStr}.${key}` : key, `Missing required field "${key}".`);
        }
      }
    }
    const known = subSchema.properties ? Object.keys(subSchema.properties) : [];
    if (subSchema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!known.includes(key)) {
          addError('UNKNOWN_FIELD', pathStr ? `${pathStr}.${key}` : key, `Field "${key}" is not allowed here.`);
        }
      }
    }
    if (subSchema.properties) {
      for (const [key, propSchema] of Object.entries(subSchema.properties)) {
        if (key in value) validateNode(value[key], propSchema, schemaRoot, pathStr ? `${pathStr}.${key}` : key);
      }
    }
  }
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildTemplateMap() {
  const registry = readJsonIfExists(TEMPLATE_REGISTRY_PATH);
  const templates = registry && Array.isArray(registry.templates) ? registry.templates : [];
  return new Map(templates.map(t => [t.templateId, t]));
}

function buildThemeMap() {
  const themeMap = new Map(Object.keys(THEMES).map(id => [id, id]));
  const catalog = readJsonIfExists(THEME_CATALOG_PATH);
  for (const item of (catalog && catalog.themes) || []) {
    if (item.themeId) themeMap.set(item.themeId, item.mapsToEngineTheme || item.themeId);
  }
  return themeMap;
}

function checkStringLength(value, maxLength, pathStr) {
  if (typeof value === 'string' && value.length > maxLength) {
    addError('TEXT_TOO_LONG', pathStr, `Text has ${value.length} characters; maximum is ${maxLength}.`);
  }
}

function checkMaxItems(value, maxItems, pathStr) {
  if (Array.isArray(value) && value.length > maxItems) {
    addError('TOO_MANY_ITEMS', pathStr, `Array has ${value.length} items; maximum is ${maxItems}.`);
  }
}

function validateDensity(content, limits, pathStr) {
  if (!content || typeof content !== 'object' || !limits) return;

  for (const [key, limit] of Object.entries(limits)) {
    if (limit.maxLength != null && key in content) checkStringLength(content[key], limit.maxLength, `${pathStr}.${key}`);
    if (limit.maxItems != null && key in content) checkMaxItems(content[key], limit.maxItems, `${pathStr}.${key}`);
  }

  if (limits.itemText && Array.isArray(content.items)) {
    content.items.forEach((item, i) => checkStringLength(item, limits.itemText.maxLength, `${pathStr}.items[${i}]`));
  }
  if (limits.cardsPerSection && Array.isArray(content.sections)) {
    content.sections.forEach((section, i) => checkMaxItems(section.cards, limits.cardsPerSection.maxItems, `${pathStr}.sections[${i}].cards`));
  }
  if (limits.cardBody && Array.isArray(content.sections)) {
    content.sections.forEach((section, i) => {
      (section.cards || []).forEach((card, j) => checkStringLength(card.body, limits.cardBody.maxLength, `${pathStr}.sections[${i}].cards[${j}].body`));
    });
  }
  if (limits.paragraphsPerCard && Array.isArray(content.cards)) {
    content.cards.forEach((card, i) => checkMaxItems(card.paragraphs, limits.paragraphsPerCard.maxItems, `${pathStr}.cards[${i}].paragraphs`));
  }
  if (limits.tilesPerRow && Array.isArray(content.rows)) {
    content.rows.forEach((row, i) => checkMaxItems(row.tiles, limits.tilesPerRow.maxItems, `${pathStr}.rows[${i}].tiles`));
  }
  if (limits.value && Array.isArray(content.rows)) {
    content.rows.forEach((row, i) => {
      (row.tiles || []).forEach((tile, j) => checkStringLength(String(tile.value || ''), limits.value.maxLength, `${pathStr}.rows[${i}].tiles[${j}].value`));
    });
  }
}

function validateReferences(data) {
  if (!data || typeof data !== 'object') return;
  const templateMap = buildTemplateMap();
  const themeMap = buildThemeMap();

  const deckTheme = data.deck && data.deck.themeId;
  if (deckTheme && !themeMap.has(deckTheme)) {
    addError('UNKNOWN_THEME_ID', '$.deck.themeId', `Unknown themeId "${deckTheme}".`);
  }

  if (!Array.isArray(data.slides)) return;
  data.slides.forEach((slide, i) => {
    if (!slide || typeof slide !== 'object') return;
    const p = `$.slides[${i}]`;
    const template = templateMap.get(slide.templateId);
    if (!template) {
      addError('UNKNOWN_TEMPLATE_ID', `${p}.templateId`, `Unknown templateId "${slide.templateId}".`);
    }

    const runtimeTheme = themeMap.get(slide.themeId);
    if (slide.themeId && !runtimeTheme) {
      addError('UNKNOWN_THEME_ID', `${p}.themeId`, `Unknown themeId "${slide.themeId}".`);
    } else if (template && Array.isArray(template.allowedThemeIds) && !template.allowedThemeIds.includes(runtimeTheme)) {
      addError('INVALID_THEME_FOR_TEMPLATE', `${p}.themeId`, `Theme "${slide.themeId}" is not allowed for ${slide.templateId}.`);
    }

    if (template && slide.content && typeof slide.content === 'object') {
      for (const field of template.requiredFields || []) {
        if (!(field in slide.content)) {
          addError('MISSING_REQUIRED_FIELD', `${p}.content.${field}`, `Template ${slide.templateId} requires content.${field}.`);
        }
      }
      validateDensity(slide.content, template.densityLimits, `${p}.content`);
    }
  });
}

function validateFile(filePath) {
  errors.length = 0;
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    addError('INVALID_JSON', filePath, err.message);
    return { ok: false, errors };
  }
  validateNode(data, schema, schema, '$');
  validateReferences(data);
  return { ok: errors.length === 0, errors };
}

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node tools/validate_slidespec.js <slidespec.json>');
    process.exit(1);
  }
  const result = validateFile(file);
  if (result.ok) {
    console.log(`✔ ${file} is a valid SlideSpec.`);
    process.exit(0);
  }
  console.error(`✖ ${file} failed SlideSpec validation:`);
  for (const e of result.errors) {
    console.error(`  [${e.code}] ${e.path}: ${e.message}`);
  }
  process.exit(1);
}

main();
