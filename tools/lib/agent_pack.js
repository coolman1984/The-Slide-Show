'use strict';

const fs = require('fs');
const path = require('path');
const { THEMES } = require('../../engine/lib/themes');

const ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATE_REGISTRY = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'templates', 'registry.json'), 'utf8')
);
const SURFACE_REGISTRY = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'themes', 'surface-styles.json'), 'utf8')
);

const TRANSITIONS = ['slide', 'fade', 'zoom', 'vertical', 'flip', 'deck', 'none'];
const ANIMATION_PROFILES = ['executive', 'editorial', 'kinetic', 'calm', 'none'];
const DENSITIES = ['compact', 'comfortable', 'spacious'];
const OUTPUT_TYPES = ['single_slide', 'deck', 'meeting_package'];
const SLIDE_SIZES = ['16:9', '4:3', 'A4 landscape'];
const CONFIDENTIALITY = ['off', 'confidential', 'internal', 'management_only'];
const LANGUAGE_OPTIONS = ['en', 'ar', 'mixed'];

const FONT_PROFILES = [
  {
    id: 'modern_sans',
    label: 'Modern Sans',
    heading: '"Aptos Display","Trebuchet MS","Segoe UI",Arial,sans-serif',
    body: '"Aptos","Segoe UI","Helvetica Neue",Arial,sans-serif',
  },
  {
    id: 'editorial_serif',
    label: 'Editorial Serif',
    heading: 'Georgia,"Cambria","Times New Roman",serif',
    body: '"Aptos","Segoe UI","Helvetica Neue",Arial,sans-serif',
  },
  {
    id: 'technical_mono',
    label: 'Technical Mono',
    heading: '"Bahnschrift","Arial Narrow","Segoe UI",Arial,sans-serif',
    body: '"Cascadia Code",Consolas,"Courier New",monospace',
  },
  {
    id: 'geometric_display',
    label: 'Geometric Display',
    heading: '"Trebuchet MS","Aptos Display","Segoe UI",Arial,sans-serif',
    body: '"Segoe UI","Helvetica Neue",Arial,sans-serif',
  },
];

const SURFACE_ALIAS = {
  'rounded-card': 'classic',
  'sharp-card': 'sharp',
  'glass-card': 'glass',
  'ticket-cutout': 'ticket',
  'folder-tab': 'folder',
};

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function slugify(value, fallback) {
  const base = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || fallback;
}

function normalizeSurface(styleId) {
  return SURFACE_ALIAS[styleId] || styleId || 'classic';
}

function trimText(value, fallback) {
  const text = String(value || '').trim();
  return text || fallback;
}

function parseList(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean);
}

function runtimeSurfaceStyles() {
  return SURFACE_REGISTRY.styles
    .filter((style) => style.implementationStatus === 'implemented')
    .map((style) => ({
      id: style.styleId,
      label: style.label,
      allowedUse: style.allowedUse,
    }));
}

function catalogTemplates() {
  return TEMPLATE_REGISTRY.templates.map((template) => ({
    templateId: template.templateId,
    label: template.label,
    slideType: template.slideType,
    requiredFields: template.requiredFields,
    optionalFields: template.optionalFields,
    densityLimits: template.densityLimits,
    allowedThemeIds: template.allowedThemeIds || [],
    allowedSurfaceStyles: ensureArray(template.allowedSurfaceStyles).map(normalizeSurface),
  }));
}

function catalogThemes() {
  return Object.entries(THEMES).map(([themeId, theme]) => ({
    themeId,
    label: theme.label,
    mode: theme.mode,
    headingFont: theme.fonts.heading,
    bodyFont: theme.fonts.body,
    stage: theme.background.stage,
    page: theme.background.page,
    radius: theme.radius.cardXl,
    accents: {
      a1: theme.accents.a1.color,
      a2: theme.accents.a2.color,
      a3: theme.accents.a3.color,
      a4: theme.accents.a4.color,
    },
  }));
}

function getCatalog() {
  return {
    templates: catalogTemplates(),
    themes: catalogThemes(),
    surfaces: runtimeSurfaceStyles(),
    fontProfiles: FONT_PROFILES,
    transitions: TRANSITIONS,
    animationProfiles: ANIMATION_PROFILES,
    densities: DENSITIES,
    outputs: OUTPUT_TYPES,
    slideSizes: SLIDE_SIZES,
    confidentiality: CONFIDENTIALITY,
    languages: LANGUAGE_OPTIONS,
  };
}

function getTemplate(templateId) {
  return getCatalog().templates.find((template) => template.templateId === templateId) || getCatalog().templates[0];
}

function getTheme(themeId) {
  return getCatalog().themes.find((theme) => theme.themeId === themeId) || getCatalog().themes[0];
}

function getFontProfile(fontProfile) {
  return FONT_PROFILES.find((item) => item.id === fontProfile) || FONT_PROFILES[0];
}

function buildValidation(state) {
  const warnings = [];
  const template = getTemplate(state.templateId);
  const facts = parseList(state.factsText);
  const sourceFiles = ensureArray(state.sourceFiles);

  if (!sourceFiles.length && !facts.length) {
    warnings.push('No source files or prepared facts were provided. The work agent will need manual content.');
  }

  if (state.language === 'mixed' && state.fontProfile === 'technical_mono') {
    warnings.push('Mixed-language work may be harder to read in the Technical Mono profile.');
  }

  if (template && template.allowedSurfaceStyles.length && !template.allowedSurfaceStyles.includes(state.surfaceStyle)) {
    warnings.push(`Surface "${state.surfaceStyle}" is outside the template contract for ${template.label}.`);
  }

  if (template && template.allowedThemeIds.length && !template.allowedThemeIds.includes(state.themeId)) {
    warnings.push(`Theme "${state.themeId}" is renderer-supported but not yet listed in the template registry for ${template.label}.`);
  }

  if (template && template.slideType === 'title') {
    const max = (((template.densityLimits || {}).heading || {}).maxLength) || 46;
    if (state.slideTitle.length > max) {
      warnings.push(`Title length is ${state.slideTitle.length}. Keep title slides at ${max} characters or less.`);
    }
  }

  if (template && template.slideType === 'agenda') {
    const maxItems = (((template.densityLimits || {}).items || {}).maxItems) || 8;
    if (facts.length > maxItems) {
      warnings.push(`Agenda-like fact count is ${facts.length}. The agenda contract expects ${maxItems} items or fewer.`);
    }
  }

  if (template && template.slideType === 'kpi-dashboard') {
    const maxRows = (((template.densityLimits || {}).rows || {}).maxItems) || 2;
    if (facts.length > maxRows * 4) {
      warnings.push(`KPI fact count is ${facts.length}. The dashboard contract will likely need summarization.`);
    }
  }

  return warnings;
}

function normalizeState(input) {
  const catalog = getCatalog();
  const template = getTemplate(input.templateId || catalog.templates[0].templateId);
  const theme = getTheme(input.themeId || catalog.themes[0].themeId);
  const sourceFiles = ensureArray(input.sourceFiles).map((item) => {
    if (!item) return null;
    if (typeof item === 'string') return { name: path.basename(item), kind: inferSourceKind(item) };
    const name = trimText(item.name, 'source-file');
    return { name, kind: trimText(item.kind, inferSourceKind(name)) };
  }).filter(Boolean);

  const state = {
    projectName: trimText(input.projectName, 'SlideForge Control Board Demo'),
    meetingName: trimText(input.meetingName, 'Management Review'),
    requestedOutput: OUTPUT_TYPES.includes(input.requestedOutput) ? input.requestedOutput : 'single_slide',
    slideSize: SLIDE_SIZES.includes(input.slideSize) ? input.slideSize : '16:9',
    language: LANGUAGE_OPTIONS.includes(input.language) ? input.language : 'en',
    confidentiality: CONFIDENTIALITY.includes(input.confidentiality) ? input.confidentiality : 'confidential',
    templateId: template.templateId,
    slideType: template.slideType,
    themeId: theme.themeId,
    surfaceStyle: normalizeSurface(input.surfaceStyle || template.allowedSurfaceStyles[0] || 'classic'),
    animationProfile: ANIMATION_PROFILES.includes(input.animationProfile) ? input.animationProfile : 'executive',
    transition: TRANSITIONS.includes(input.transition) ? input.transition : 'slide',
    density: DENSITIES.includes(input.density) ? input.density : 'comfortable',
    fontProfile: getFontProfile(input.fontProfile).id,
    slideTitle: trimText(input.slideTitle, `${template.label} Preview`),
    slideSubtitle: trimText(input.slideSubtitle, 'Prepared by the offline Control Board'),
    factsText: trimText(input.factsText, [
      'Monthly saving: 38,500 USD',
      'Highest impact area: Automation reporting',
      'Primary risk: Two workflows still depend on manual SAP validation',
    ].join('\n')),
    warningsText: trimText(input.warningsText, 'No extraction warnings were supplied.'),
    sourceFiles,
    notesText: trimText(input.notesText, 'Use prepared facts only. Do not inspect raw source files.'),
    jobId: trimText(input.jobId, `${slugify(input.projectName, 'project')}-${slugify(input.meetingName, 'meeting')}-${template.slideType}`),
  };

  state.validationWarnings = buildValidation(state);
  return state;
}

function inferSourceKind(name) {
  const ext = path.extname(String(name || '')).toLowerCase();
  if (ext === '.xlsx' || ext === '.xlsm' || ext === '.xls') return 'excel';
  if (ext === '.docx' || ext === '.doc') return 'word';
  if (ext === '.pdf') return 'pdf';
  if (ext === '.pptx' || ext === '.ppt') return 'pptx';
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') return 'image';
  return 'file';
}

function buildSlideJob(state) {
  return {
    job_id: state.jobId,
    job_mode: 'weak_agent_safe',
    project_name: state.projectName,
    meeting_name: state.meetingName,
    requested_output: state.requestedOutput,
    slide_size: state.slideSize,
    language: state.language,
    confidentiality: state.confidentiality,
    slide_type: state.slideType,
    template_id: state.templateId,
    theme_id: state.themeId,
    font_profile: state.fontProfile,
    surface_style: state.surfaceStyle,
    animation_profile: state.animationProfile,
    transition: state.transition,
    density: state.density,
    locked_design: true,
    data_inputs: [
      { kind: 'fact_pack', path: '02_extracted/markdown/05_slide_ready_facts.md' },
      { kind: 'data_index', path: '02_extracted/markdown/00_data_index.md' },
      { kind: 'warnings', path: '02_extracted/markdown/06_data_warnings.md' },
    ],
    source_files: state.sourceFiles,
    agent_permissions: {
      can_rewrite_text: true,
      can_select_facts_from_fact_pack: true,
      can_change_template: false,
      can_change_theme: false,
      can_change_colors: false,
      can_change_layout: false,
      can_read_raw_sources: false,
      can_invent_data: false,
    },
  };
}

function buildLockedChoices(state) {
  return {
    template_id: state.templateId,
    slide_type: state.slideType,
    theme_id: state.themeId,
    font_profile: state.fontProfile,
    surface_style: state.surfaceStyle,
    animation_profile: state.animationProfile,
    transition: state.transition,
    density: state.density,
    slide_size: state.slideSize,
    language: state.language,
    confidentiality: state.confidentiality,
  };
}

function buildRenderConfig(state) {
  return {
    meta: {
      title: state.projectName,
      theme: state.themeId,
      transition: state.transition,
      animationProfile: state.animationProfile,
      surfaceStyle: state.surfaceStyle,
      lang: state.language === 'mixed' ? 'en' : state.language,
    },
    preview: {
      templateId: state.templateId,
      slideTitle: state.slideTitle,
      slideSubtitle: state.slideSubtitle,
      density: state.density,
      fontProfile: state.fontProfile,
    },
  };
}

function buildAgentTask(state) {
  return [
    '# Agent Task',
    '',
    `Project: ${state.projectName}`,
    `Meeting: ${state.meetingName}`,
    `Job ID: ${state.jobId}`,
    '',
    'Read these files in order:',
    '1. 00_control/agent_task.md',
    '2. 00_control/slide_job.json',
    '3. 00_control/locked_choices.json',
    '4. 02_extracted/markdown/00_data_index.md',
    '5. 02_extracted/markdown/05_slide_ready_facts.md',
    '6. 02_extracted/markdown/06_data_warnings.md',
    '',
    'Do:',
    '- Keep the locked choices unchanged.',
    '- Use prepared facts only.',
    '- Rewrite text only when needed for slide fit.',
    '- Report exact data gaps or conflicts.',
    '',
    'Do not:',
    '- change template, theme, or surface style',
    '- read raw Excel, Word, PDF, or PPTX files',
    '- invent numbers, dates, owners, or statuses',
    '- remove warnings from the fact pack',
    '',
    `Requested output: ${state.requestedOutput}`,
    `Target slide type: ${state.slideType}`,
    '',
    'If a requested capability is not supported by the current deck format, reply:',
    'This needs a coding-agent change.',
    '',
    'Working note:',
    state.notesText,
    '',
  ].join('\n');
}

function buildDataIndex(state) {
  const sourceLines = state.sourceFiles.length
    ? state.sourceFiles.map((file) => `- ${file.name} (${file.kind})`)
    : ['- No raw source files were attached to this Agent Pack.'];
  return [
    '# Data Index',
    '',
    `Project: ${state.projectName}`,
    `Meeting: ${state.meetingName}`,
    '',
    'Use these files:',
    '- 05_slide_ready_facts.md for slide facts',
    '- 06_data_warnings.md before finalizing any number or status',
    '',
    'Source files attached to this job:',
    ...sourceLines,
    '',
    'Do not use raw sources unless Mohamed explicitly asks for that.',
    '',
  ].join('\n');
}

function buildSlideReadyFacts(state) {
  const facts = parseList(state.factsText);
  const factLines = facts.length
    ? facts.map((fact, index) => `- ${fact}\n  Source: prepared fact ${index + 1}`)
    : ['- No prepared facts were supplied.\n  Source: manual content mode'];
  return [
    '# Slide-Ready Facts',
    '',
    `Recommended slide type: ${state.slideType}`,
    `Locked theme: ${state.themeId}`,
    '',
    'Facts:',
    ...factLines,
    '',
  ].join('\n');
}

function buildDataWarnings(state) {
  const warnings = parseList(state.warningsText);
  const lines = warnings.length ? warnings.map((warning) => `- ${warning}`) : ['- No warnings supplied.'];
  return [
    '# Data Warnings',
    '',
    ...lines,
    '',
    ...state.validationWarnings.map((warning) => `- Control Board warning: ${warning}`),
    '',
  ].join('\n');
}

function buildValidationSummary(state) {
  const warnings = state.validationWarnings.length
    ? state.validationWarnings.map((warning) => `- ${warning}`)
    : ['- No Control Board validation warnings.'];
  return [
    '# Validation Summary',
    '',
    `Template: ${state.templateId}`,
    `Theme: ${state.themeId}`,
    `Surface: ${state.surfaceStyle}`,
    `Animation: ${state.animationProfile}`,
    `Transition: ${state.transition}`,
    '',
    'Warnings:',
    ...warnings,
    '',
  ].join('\n');
}

function buildControlState(state) {
  return {
    projectName: state.projectName,
    meetingName: state.meetingName,
    requestedOutput: state.requestedOutput,
    slideSize: state.slideSize,
    language: state.language,
    confidentiality: state.confidentiality,
    templateId: state.templateId,
    themeId: state.themeId,
    surfaceStyle: state.surfaceStyle,
    animationProfile: state.animationProfile,
    transition: state.transition,
    density: state.density,
    fontProfile: state.fontProfile,
    slideTitle: state.slideTitle,
    slideSubtitle: state.slideSubtitle,
    factsText: state.factsText,
    warningsText: state.warningsText,
    notesText: state.notesText,
    sourceFiles: state.sourceFiles,
    jobId: state.jobId,
  };
}

function buildAgentPackFiles(input) {
  const state = normalizeState(input);
  return {
    state,
    files: {
      '00_control/agent_task.md': buildAgentTask(state),
      '00_control/slide_job.json': JSON.stringify(buildSlideJob(state), null, 2) + '\n',
      '00_control/locked_choices.json': JSON.stringify(buildLockedChoices(state), null, 2) + '\n',
      '00_control/render_config.json': JSON.stringify(buildRenderConfig(state), null, 2) + '\n',
      '00_control/control_state.json': JSON.stringify(buildControlState(state), null, 2) + '\n',
      '00_control/validation_summary.md': buildValidationSummary(state),
      '02_extracted/markdown/00_data_index.md': buildDataIndex(state),
      '02_extracted/markdown/05_slide_ready_facts.md': buildSlideReadyFacts(state),
      '02_extracted/markdown/06_data_warnings.md': buildDataWarnings(state),
    },
  };
}

function writeAgentPack(outDir, input) {
  const pack = buildAgentPackFiles(input);
  const root = path.resolve(outDir);
  Object.entries(pack.files).forEach(([relativePath, contents]) => {
    const file = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
  });
  return {
    outDir: root,
    state: pack.state,
    files: Object.keys(pack.files).map((item) => toPosix(item)),
  };
}

function makeDemoState() {
  return normalizeState({
    projectName: 'Orion Factory Control',
    meetingName: 'Weekly Executive Factory Review',
    requestedOutput: 'single_slide',
    slideSize: '16:9',
    language: 'en',
    confidentiality: 'management_only',
    templateId: 'family-001-kpi-dashboard',
    themeId: 'mint-lab',
    surfaceStyle: 'soft',
    animationProfile: 'calm',
    transition: 'vertical',
    density: 'comfortable',
    fontProfile: 'geometric_display',
    slideTitle: 'Factory signal snapshot',
    slideSubtitle: 'Prepared through the offline Control Board workflow',
    factsText: [
      'Output attainment: 96.4 percent versus 95.0 target',
      'Scrap ratio improved to 1.9 percent from 2.4 percent last month',
      'Automation savings reached 38,500 USD this month',
      'Main risk: two reporting workflows still require manual SAP checks',
      'Top gain area: SMT line changeover discipline',
    ].join('\n'),
    warningsText: [
      'Pivot table refresh was not confirmed in the source workbook.',
      'One source note mixes Arabic owner names with English department labels.',
    ].join('\n'),
    sourceFiles: [
      { name: 'orion-monthly-control.xlsx', kind: 'excel' },
      { name: 'orion-automation-notes.docx', kind: 'word' },
      { name: 'orion-capacity-risk.pdf', kind: 'pdf' },
    ],
    notesText: 'Summarize the prepared facts into one KPI slide and preserve the risk note.',
  });
}

module.exports = {
  ANIMATION_PROFILES,
  CONFIDENTIALITY,
  DENSITIES,
  FONT_PROFILES,
  LANGUAGE_OPTIONS,
  OUTPUT_TYPES,
  SLIDE_SIZES,
  TRANSITIONS,
  buildAgentPackFiles,
  getCatalog,
  makeDemoState,
  normalizeState,
  writeAgentPack,
};
