#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { buildAgentPackFiles, getCatalog, makeDemoState, normalizeState, writeAgentPack } = require('./lib/agent_pack');

const ROOT = path.resolve(__dirname, '..');
const DIST_HTML = path.join(ROOT, 'dist', 'control-board.html');
const PACKAGE_DIR = path.join(ROOT, 'packages', 'control-board-demo');
const PACKAGE_HTML = path.join(PACKAGE_DIR, 'control-board.html');
const PACKAGE_README = path.join(PACKAGE_DIR, 'README-open-this-file.txt');

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHtml() {
  const catalog = getCatalog();
  const demoState = normalizeState(makeDemoState());

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SlideForge Control Board</title>
<style>
:root{
  --board:#ffffff;
  --ink:#162135;
  --muted:#627086;
  --line:rgba(22,33,53,.12);
  --accent:#0d9488;
  --accent-2:#f97316;
  --warn:#b45309;
  --good:#15803d;
  --shadow:0 14px 40px rgba(22,33,53,.08);
  --radius-xl:14px;
  --radius-lg:10px;
  --radius-md:6px;
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family:"Aptos","Segoe UI","Helvetica Neue",Arial,sans-serif;
  color:var(--ink);
  background:
    linear-gradient(90deg, rgba(22,33,53,.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(22,33,53,.03) 1px, transparent 1px),
    linear-gradient(180deg,#f9fbfa 0%,#f1f3ef 100%);
  background-size:32px 32px,32px 32px,auto;
}
a{color:inherit}
.shell{
  width:min(1580px, calc(100vw - 24px));
  margin:12px auto;
  display:grid;
  grid-template-columns:minmax(520px, 1fr) minmax(520px, .95fr);
  gap:12px;
}
.panel{
  background:rgba(255,255,255,.92);
  border:1px solid var(--line);
  border-radius:var(--radius-xl);
  box-shadow:var(--shadow);
}
.controls{
  display:grid;
  gap:10px;
}
.appbar{
  display:grid;
  grid-template-columns:1fr auto;
  gap:16px;
  align-items:end;
  padding:12px 2px 4px;
}
.appbar h1{
  margin:0;
  font-family:"Bahnschrift","Aptos Display","Segoe UI",Arial,sans-serif;
  font-size:28px;
  line-height:1;
}
.appbar p{margin:6px 0 0;color:var(--muted);line-height:1.35}
.health-strip{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.health{
  border:1px solid var(--line);
  border-radius:999px;
  padding:7px 10px;
  background:#fff;
  font-size:12px;
  color:var(--muted);
}
.workflow{
  display:grid;
  grid-template-columns:repeat(5,minmax(0,1fr));
  gap:8px;
}
.step{
  min-height:54px;
  border:1px solid var(--line);
  border-radius:10px;
  background:#fff;
  padding:9px 10px;
  display:grid;
  align-content:center;
  gap:3px;
}
.step b{font-size:12px;color:var(--accent);letter-spacing:.04em;text-transform:uppercase}
.step span{font-size:12px;color:var(--muted);line-height:1.25}
.section{
  padding:14px;
}
.section-head{
  display:flex;
  justify-content:space-between;
  gap:14px;
  align-items:flex-start;
  margin-bottom:10px;
}
.section-head h2{
  margin:0 0 4px;
  font-family:"Trebuchet MS","Aptos Display","Segoe UI",Arial,sans-serif;
  font-size:18px;
}
.section-head p{
  margin:0;
  color:var(--muted);
  line-height:1.45;
}
.badge{
  padding:7px 10px;
  border-radius:6px;
  background:rgba(13,148,136,.10);
  color:#0f766e;
  font-size:12px;
  white-space:nowrap;
}
.grid-2,.grid-3{
  display:grid;
  gap:12px;
}
.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
label{
  display:grid;
  gap:8px;
  font-size:13px;
  color:var(--muted);
}
input,select,textarea,button{
  font:inherit;
}
input,select,textarea{
  width:100%;
  border:1px solid var(--line);
  border-radius:8px;
  padding:10px 11px;
  background:#fff;
  color:var(--ink);
}
textarea{
  min-height:92px;
  resize:vertical;
  line-height:1.45;
}
input[type="file"]{
  padding:10px 12px;
}
.file-list{
  min-height:44px;
  padding:10px 12px;
  border:1px dashed var(--line);
  border-radius:8px;
  background:rgba(22,33,53,.025);
  color:var(--muted);
  line-height:1.5;
}
.choice-row{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
}
.actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:14px;
}
button{
  border:0;
  border-radius:8px;
  padding:10px 14px;
  cursor:pointer;
}
.btn-primary{
  background:linear-gradient(135deg,#0d9488,#0f766e);
  color:#f7fffd;
}
.btn-secondary{
  background:#fff;
  color:var(--ink);
  border:1px solid var(--line);
}
.preview-shell{
  display:grid;
  grid-template-rows:auto 1fr auto;
  min-height:calc(100vh - 24px);
}
.preview-head{
  padding:18px 18px 0;
  display:flex;
  justify-content:space-between;
  gap:12px;
  align-items:flex-start;
}
.preview-head h2{
  margin:0 0 4px;
  font-family:"Trebuchet MS","Aptos Display","Segoe UI",Arial,sans-serif;
  font-size:22px;
}
.preview-head p{
  margin:0;
  color:var(--muted);
}
.preview-stage-wrap{
  padding:18px;
  display:grid;
  gap:14px;
}
.preview-stage{
  position:relative;
  aspect-ratio:16/9;
  border-radius:12px;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.14);
  box-shadow:0 18px 48px rgba(15,23,42,.16);
  background:#0b1320;
  color:#fff;
}
.preview-overlay{
  position:absolute;
  inset:0;
  padding:26px 28px 24px;
  display:grid;
  grid-template-rows:auto 1fr auto;
  gap:16px;
}
.preview-kicker{
  display:flex;
  justify-content:space-between;
  gap:12px;
  font-size:12px;
  letter-spacing:.08em;
  text-transform:uppercase;
}
.preview-title{
  align-self:center;
  display:grid;
  gap:10px;
}
.preview-title h3{
  margin:0;
  font-size:clamp(26px, 3vw, 44px);
  line-height:1.02;
}
.preview-title p{
  margin:0;
  max-width:62ch;
  color:rgba(255,255,255,.78);
  line-height:1.45;
}
.preview-body{
  display:grid;
  gap:12px;
  align-content:start;
}
.preview-cards{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:12px;
}
.preview-card, .preview-tile, .preview-agenda-item, .preview-col{
  border-radius:10px;
  padding:14px;
  background:rgba(255,255,255,.10);
  border:1px solid rgba(255,255,255,.18);
}
.preview-card strong,.preview-tile strong,.preview-col strong{
  display:block;
  margin-bottom:6px;
  font-size:15px;
}
.preview-card span,.preview-tile span,.preview-col span{
  color:rgba(255,255,255,.78);
  line-height:1.35;
  font-size:13px;
}
.preview-agenda{
  display:grid;
  gap:10px;
}
.preview-agenda-item{
  display:flex;
  gap:10px;
  align-items:flex-start;
}
.preview-agenda-item b{
  width:22px;
  flex:0 0 22px;
}
.preview-kpis{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}
.preview-tile em{
  display:block;
  font-style:normal;
  font-size:26px;
  margin-bottom:8px;
}
.preview-timeline{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}
.preview-col{
  min-height:180px;
}
.preview-tags{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:8px;
}
.preview-tag{
  padding:6px 8px;
  border-radius:999px;
  background:rgba(255,255,255,.14);
  font-size:11px;
  letter-spacing:.05em;
  text-transform:uppercase;
}
.preview-footer{
  display:flex;
  justify-content:space-between;
  gap:12px;
  color:rgba(255,255,255,.7);
  font-size:12px;
  letter-spacing:.06em;
  text-transform:uppercase;
}
.status-box{
  display:grid;
  gap:10px;
}
.status-item{
  border-radius:10px;
  border:1px solid var(--line);
  background:#fff;
  padding:12px 14px;
  line-height:1.45;
}
.status-item strong{
  display:block;
  margin-bottom:4px;
}
.code-box{
  border-radius:10px;
  background:#101728;
  color:#dbe7ff;
  padding:16px;
  overflow:auto;
  min-height:260px;
  white-space:pre-wrap;
  line-height:1.45;
  font-family:"Cascadia Code",Consolas,"Courier New",monospace;
  font-size:12px;
}
.preview-foot{
  padding:0 18px 18px;
}
.helper{
  color:var(--muted);
  font-size:13px;
  line-height:1.45;
}
.download-note{
  color:#0f766e;
  font-size:13px;
}
@media (max-width: 1120px){
  .shell{grid-template-columns:1fr}
  .preview-shell{min-height:auto}
}
@media (max-width: 780px){
  .grid-2,.grid-3,.choice-row,.preview-cards,.preview-kpis,.preview-timeline{
    grid-template-columns:1fr;
  }
  .shell{width:min(100vw - 16px, 1500px);margin:8px auto}
  .workflow{grid-template-columns:1fr}
  .appbar{grid-template-columns:1fr}
  .health-strip{justify-content:flex-start}
}
</style>
</head>
<body>
  <div class="shell">
    <div class="controls">
      <header class="appbar">
        <div>
          <h1>SlideForge Control Board</h1>
          <p>Choose source, data, design, quality, and handoff settings. The Agent Pack locks those choices for the work agent.</p>
        </div>
        <div class="health-strip" aria-label="System status">
          <span class="health">Offline</span>
          <span class="health">No dependencies</span>
          <span class="health">Agent locked</span>
        </div>
      </header>

      <nav class="workflow" aria-label="Workflow">
        <div class="step"><b>1 Source</b><span>Files and project context</span></div>
        <div class="step"><b>2 Data</b><span>Prepared facts and warnings</span></div>
        <div class="step"><b>3 Design</b><span>Template, theme, shape, motion</span></div>
        <div class="step"><b>4 Quality gate</b><span>Validation and preview check</span></div>
        <div class="step"><b>5 Handoff</b><span>Agent Pack files</span></div>
      </nav>

      <section class="panel section">
        <div class="section-head">
          <div>
            <h2>Project setup</h2>
            <p>These choices become part of the locked job package.</p>
          </div>
          <div class="badge">Control</div>
        </div>
        <div class="grid-2">
          <label>Project name
            <input id="projectName" type="text" value="${esc(demoState.projectName)}">
          </label>
          <label>Meeting name
            <input id="meetingName" type="text" value="${esc(demoState.meetingName)}">
          </label>
          <label>Requested output
            <select id="requestedOutput"></select>
          </label>
          <label>Slide size
            <select id="slideSize"></select>
          </label>
          <label>Language
            <select id="language"></select>
          </label>
          <label>Confidentiality
            <select id="confidentiality"></select>
          </label>
        </div>
      </section>

      <section class="panel section">
        <div class="section-head">
          <div>
            <h2>Source intake</h2>
            <p>Attach files for DataForge later, or start from prepared facts only.</p>
          </div>
          <div class="badge">Sources</div>
        </div>
        <label>Source files
          <input id="sourceFiles" type="file" multiple>
        </label>
        <div id="sourceFileList" class="file-list">No files selected yet.</div>
      </section>

      <section class="panel section">
        <div class="section-head">
          <div>
            <h2>Design lock</h2>
            <p>These choices become locked job settings for the weak agent.</p>
          </div>
          <div class="badge">Locked</div>
        </div>
        <div class="choice-row">
          <label>Template
            <select id="templateId"></select>
          </label>
          <label>Theme
            <select id="themeId"></select>
          </label>
          <label>Surface
            <select id="surfaceStyle"></select>
          </label>
          <label>Font profile
            <select id="fontProfile"></select>
          </label>
          <label>Animation
            <select id="animationProfile"></select>
          </label>
          <label>Transition
            <select id="transition"></select>
          </label>
          <label>Density
            <select id="density"></select>
          </label>
          <label>Slide title
            <input id="slideTitle" type="text" value="${esc(demoState.slideTitle)}">
          </label>
        </div>
        <label>Slide subtitle
          <input id="slideSubtitle" type="text" value="${esc(demoState.slideSubtitle)}">
        </label>
      </section>

      <section class="panel section">
        <div class="section-head">
          <div>
            <h2>Prepared facts</h2>
            <p>Write slide-ready facts in simple lines. These become Markdown files for the work agent.</p>
          </div>
          <div class="badge">Facts</div>
        </div>
        <label>Prepared facts
          <textarea id="factsText">${esc(demoState.factsText)}</textarea>
        </label>
        <label>Warnings
          <textarea id="warningsText">${esc(demoState.warningsText)}</textarea>
        </label>
        <label>Work note
          <textarea id="notesText">${esc(demoState.notesText)}</textarea>
        </label>
        <div class="actions">
          <button id="downloadPack" class="btn-primary" type="button">Download Agent Pack files</button>
          <button id="downloadState" class="btn-secondary" type="button">Download control state JSON</button>
          <button id="loadDemo" class="btn-secondary" type="button">Restore demo values</button>
        </div>
        <div id="downloadNote" class="download-note"></div>
      </section>
    </div>

    <div class="panel preview-shell">
      <div class="preview-head">
        <div>
          <h2>Live preview and output</h2>
          <p>The preview is lightweight, but the job files are real and usable by the work agent.</p>
        </div>
        <div class="badge">Preview</div>
      </div>

      <div class="preview-stage-wrap">
        <div id="previewStage" class="preview-stage"></div>

        <div class="status-box">
          <div class="status-item">
            <strong>Validation summary</strong>
            <div id="validationList" class="helper"></div>
          </div>
          <div class="status-item">
            <strong>CLI handoff</strong>
            <div class="helper">Use the downloaded <code>control_state.json</code> with <code>node tools/create_agent_pack.js --config control_state.json --out packages/my-agent-pack</code> if you want the files written to a folder by the local runtime.</div>
          </div>
        </div>

        <div class="code-box" id="jobPreview"></div>
      </div>

      <div class="preview-foot">
        <div class="helper">This page is self-contained and works offline. It does not fetch cloud assets, does not require a server, and does not ask the weak agent to make design decisions.</div>
      </div>
    </div>
  </div>

<script>
const CATALOG = ${JSON.stringify(catalog)};
const DEMO_STATE = ${JSON.stringify(demoState)};
const FONT_MAP = Object.fromEntries(CATALOG.fontProfiles.map((profile) => [profile.id, profile]));

const state = {
  sourceFiles: ${JSON.stringify(demoState.sourceFiles)},
};

const el = {
  projectName: document.getElementById('projectName'),
  meetingName: document.getElementById('meetingName'),
  requestedOutput: document.getElementById('requestedOutput'),
  slideSize: document.getElementById('slideSize'),
  language: document.getElementById('language'),
  confidentiality: document.getElementById('confidentiality'),
  sourceFiles: document.getElementById('sourceFiles'),
  sourceFileList: document.getElementById('sourceFileList'),
  templateId: document.getElementById('templateId'),
  themeId: document.getElementById('themeId'),
  surfaceStyle: document.getElementById('surfaceStyle'),
  fontProfile: document.getElementById('fontProfile'),
  animationProfile: document.getElementById('animationProfile'),
  transition: document.getElementById('transition'),
  density: document.getElementById('density'),
  slideTitle: document.getElementById('slideTitle'),
  slideSubtitle: document.getElementById('slideSubtitle'),
  factsText: document.getElementById('factsText'),
  warningsText: document.getElementById('warningsText'),
  notesText: document.getElementById('notesText'),
  previewStage: document.getElementById('previewStage'),
  validationList: document.getElementById('validationList'),
  jobPreview: document.getElementById('jobPreview'),
  downloadPack: document.getElementById('downloadPack'),
  downloadState: document.getElementById('downloadState'),
  loadDemo: document.getElementById('loadDemo'),
  downloadNote: document.getElementById('downloadNote'),
};

function fillSelect(select, items, valueKey, labelKey, selectedValue) {
  select.innerHTML = '';
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item[valueKey];
    option.textContent = item[labelKey];
    if (item[valueKey] === selectedValue) option.selected = true;
    select.appendChild(option);
  });
}

function fillSimpleSelect(select, items, selectedValue) {
  select.innerHTML = '';
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    if (item === selectedValue) option.selected = true;
    select.appendChild(option);
  });
}

function readList(text) {
  return String(text || '')
    .split(/\\r?\\n/)
    .map((line) => line.replace(/^\\s*[-*]\\s*/, '').trim())
    .filter(Boolean);
}

function slugify(value, fallback) {
  const base = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || fallback;
}

function currentTemplate() {
  return CATALOG.templates.find((template) => template.templateId === el.templateId.value) || CATALOG.templates[0];
}

function currentTheme() {
  return CATALOG.themes.find((theme) => theme.themeId === el.themeId.value) || CATALOG.themes[0];
}

function currentFontProfile() {
  return FONT_MAP[el.fontProfile.value] || CATALOG.fontProfiles[0];
}

function collectState() {
  const template = currentTemplate();
  return {
    projectName: el.projectName.value.trim() || DEMO_STATE.projectName,
    meetingName: el.meetingName.value.trim() || DEMO_STATE.meetingName,
    requestedOutput: el.requestedOutput.value,
    slideSize: el.slideSize.value,
    language: el.language.value,
    confidentiality: el.confidentiality.value,
    templateId: el.templateId.value,
    slideType: template.slideType,
    themeId: el.themeId.value,
    surfaceStyle: el.surfaceStyle.value,
    fontProfile: el.fontProfile.value,
    animationProfile: el.animationProfile.value,
    transition: el.transition.value,
    density: el.density.value,
    slideTitle: el.slideTitle.value.trim() || DEMO_STATE.slideTitle,
    slideSubtitle: el.slideSubtitle.value.trim() || DEMO_STATE.slideSubtitle,
    factsText: el.factsText.value.trim(),
    warningsText: el.warningsText.value.trim(),
    notesText: el.notesText.value.trim(),
    sourceFiles: state.sourceFiles,
    jobId: [
      slugify(el.projectName.value, 'project'),
      slugify(el.meetingName.value, 'meeting'),
      template.slideType,
    ].join('-'),
  };
}

function buildWarnings(snapshot) {
  const warnings = [];
  const template = currentTemplate();
  const facts = readList(snapshot.factsText);

  if (!snapshot.sourceFiles.length && !facts.length) {
    warnings.push('No source files or prepared facts were supplied.');
  }

  if (template.allowedSurfaceStyles.length && !template.allowedSurfaceStyles.includes(snapshot.surfaceStyle)) {
    warnings.push('Selected surface is outside the current template contract.');
  }

  if (template.allowedThemeIds.length && !template.allowedThemeIds.includes(snapshot.themeId)) {
    warnings.push('Selected theme is renderer-supported but not yet listed in the template registry for this template.');
  }

  if (template.slideType === 'title' && snapshot.slideTitle.length > 46) {
    warnings.push('Title slide heading is longer than the recommended limit.');
  }

  if (template.slideType === 'agenda' && facts.length > 8) {
    warnings.push('Agenda previews should stay at 8 items or fewer.');
  }

  if (template.slideType === 'kpi-dashboard' && facts.length > 8) {
    warnings.push('KPI dashboard previews should stay at 8 facts or fewer before summarization.');
  }

  if (snapshot.language === 'mixed' && snapshot.fontProfile === 'technical_mono') {
    warnings.push('Mixed-language slides may be harder to read in Technical Mono.');
  }

  return warnings;
}

function buildSlideJob(snapshot, warnings) {
  return {
    job_id: snapshot.jobId,
    job_mode: 'weak_agent_safe',
    project_name: snapshot.projectName,
    meeting_name: snapshot.meetingName,
    requested_output: snapshot.requestedOutput,
    slide_size: snapshot.slideSize,
    language: snapshot.language,
    confidentiality: snapshot.confidentiality,
    slide_type: snapshot.slideType,
    template_id: snapshot.templateId,
    theme_id: snapshot.themeId,
    font_profile: snapshot.fontProfile,
    surface_style: snapshot.surfaceStyle,
    animation_profile: snapshot.animationProfile,
    transition: snapshot.transition,
    density: snapshot.density,
    locked_design: true,
    source_files: snapshot.sourceFiles,
    control_board_warnings: warnings,
    data_inputs: [
      { kind: 'fact_pack', path: '02_extracted/markdown/05_slide_ready_facts.md' },
      { kind: 'data_index', path: '02_extracted/markdown/00_data_index.md' },
      { kind: 'warnings', path: '02_extracted/markdown/06_data_warnings.md' },
    ],
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

function buildAgentTask(snapshot) {
  return [
    '# Agent Task',
    '',
    'Read these files in order:',
    '1. 00_control/agent_task.md',
    '2. 00_control/slide_job.json',
    '3. 00_control/locked_choices.json',
    '4. 02_extracted/markdown/00_data_index.md',
    '5. 02_extracted/markdown/05_slide_ready_facts.md',
    '6. 02_extracted/markdown/06_data_warnings.md',
    '',
    'Do not change locked design choices.',
    'Do not read raw source files.',
    'Do not invent numbers or statuses.',
    '',
    'Working note:',
    snapshot.notesText || 'Use prepared facts only.',
    '',
  ].join('\\n');
}

function buildPack(snapshot, warnings) {
  const facts = readList(snapshot.factsText);
  const dataWarnings = readList(snapshot.warningsText);
  return {
    '00_control/agent_task.md': buildAgentTask(snapshot),
    '00_control/slide_job.json': JSON.stringify(buildSlideJob(snapshot, warnings), null, 2) + '\\n',
    '00_control/locked_choices.json': JSON.stringify({
      template_id: snapshot.templateId,
      slide_type: snapshot.slideType,
      theme_id: snapshot.themeId,
      font_profile: snapshot.fontProfile,
      surface_style: snapshot.surfaceStyle,
      animation_profile: snapshot.animationProfile,
      transition: snapshot.transition,
      density: snapshot.density,
      slide_size: snapshot.slideSize,
      language: snapshot.language,
      confidentiality: snapshot.confidentiality,
    }, null, 2) + '\\n',
    '00_control/control_state.json': JSON.stringify(snapshot, null, 2) + '\\n',
    '00_control/validation_summary.md': [
      '# Validation Summary',
      '',
      ...(warnings.length ? warnings.map((warning) => '- ' + warning) : ['- No Control Board validation warnings.']),
      '',
    ].join('\\n'),
    '02_extracted/markdown/00_data_index.md': [
      '# Data Index',
      '',
      'Use these files:',
      '- 05_slide_ready_facts.md',
      '- 06_data_warnings.md',
      '',
      'Attached source files:',
      ...(snapshot.sourceFiles.length ? snapshot.sourceFiles.map((file) => '- ' + file.name + ' (' + file.kind + ')') : ['- No raw files attached.']),
      '',
    ].join('\\n'),
    '02_extracted/markdown/05_slide_ready_facts.md': [
      '# Slide-Ready Facts',
      '',
      'Facts:',
      ...(facts.length ? facts.map((fact, index) => '- ' + fact + '\\n  Source: prepared fact ' + (index + 1)) : ['- No prepared facts supplied.']),
      '',
    ].join('\\n'),
    '02_extracted/markdown/06_data_warnings.md': [
      '# Data Warnings',
      '',
      ...(dataWarnings.length ? dataWarnings.map((warning) => '- ' + warning) : ['- No source warnings supplied.']),
      ...warnings.map((warning) => '- Control Board warning: ' + warning),
      '',
    ].join('\\n'),
  };
}

function download(name, contents, type) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name.split('/').pop();
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}

function previewFacts(snapshot) {
  const facts = readList(snapshot.factsText);
  return facts.length ? facts : readList(DEMO_STATE.factsText);
}

function surfaceClass(style) {
  return 'surface-' + style;
}

function renderPreview(snapshot, warnings) {
  const theme = currentTheme();
  const font = currentFontProfile();
  const facts = previewFacts(snapshot);
  const template = currentTemplate();
  const accent = theme.accents;
  const footerText = snapshot.confidentiality.replace(/_/g, ' ');
  const surface = surfaceClass(snapshot.surfaceStyle);

  let body = '';
  if (template.slideType === 'agenda') {
    body = '<div class="preview-agenda">' + facts.slice(0, 6).map((fact, index) => '<div class="preview-agenda-item '+surface+'"><b>' + (index + 1) + '</b><span>' + escapeHtml(fact) + '</span></div>').join('') + '</div>';
  } else if (template.slideType === 'kpi-dashboard') {
    body = '<div class="preview-kpis">' + facts.slice(0, 8).map((fact) => {
      const parts = fact.split(':');
      const value = escapeHtml((parts[1] || parts[0] || '').trim().slice(0, 12) || 'Value');
      const label = escapeHtml((parts[0] || 'Metric').trim().slice(0, 32));
      return '<div class="preview-tile '+surface+'"><em>' + value + '</em><strong>' + label + '</strong><span>Locked by Control Board</span></div>';
    }).join('') + '</div>';
  } else if (template.slideType === 'timeline-matrix') {
    const cols = ['Now', 'Next', 'Soon', 'Later'].map((label, index) => {
      const items = facts.slice(index, index + 2).map((fact) => '<div class="preview-tag">' + escapeHtml(fact.slice(0, 24)) + '</div>').join('');
      return '<div class="preview-col '+surface+'"><strong>' + label + '</strong><span>Structured stage bucket</span><div class="preview-tags">' + items + '</div></div>';
    }).join('');
    body = '<div class="preview-timeline">' + cols + '</div>';
  } else {
    body = '<div class="preview-cards">' + facts.slice(0, 3).map((fact, index) => '<div class="preview-card '+surface+'"><strong>Card ' + (index + 1) + '</strong><span>' + escapeHtml(fact) + '</span></div>').join('') + '</div>';
  }

  el.previewStage.style.background = theme.stage;
  el.previewStage.style.color = theme.mode === 'light' ? '#111827' : '#ffffff';
  el.previewStage.innerHTML = [
    '<div class="preview-overlay '+surface+'" style="--card-radius:'+theme.radius+';font-family:'+font.body+'">',
      '<div class="preview-kicker" style="color:'+accent.a2+'"><span>' + escapeHtml(template.label) + '</span><span>' + escapeHtml(theme.label) + '</span></div>',
      '<div class="preview-title" style="font-family:'+font.heading+'">',
        '<h3>' + escapeHtml(snapshot.slideTitle) + '</h3>',
        '<p>' + escapeHtml(snapshot.slideSubtitle) + '</p>',
      '</div>',
      '<div class="preview-body">' + body + '</div>',
      '<div class="preview-footer"><span>' + escapeHtml(snapshot.projectName) + '</span><span>' + escapeHtml(footerText) + '</span></div>',
    '</div>'
  ].join('');

  Array.from(el.previewStage.querySelectorAll('.preview-card,.preview-tile,.preview-agenda-item,.preview-col')).forEach((node, index) => {
    const colors = [accent.a1, accent.a2, accent.a3, accent.a4];
    const color = colors[index % colors.length];
    node.style.borderColor = alpha(color, .32);
    node.style.background = tint(snapshot.surfaceStyle, color, theme.mode);
  });
}

function alpha(hex, opacity) {
  const safe = String(hex || '#888888').replace('#', '');
  const r = parseInt(safe.slice(0, 2), 16) || 136;
  const g = parseInt(safe.slice(2, 4), 16) || 136;
  const b = parseInt(safe.slice(4, 6), 16) || 136;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

function tint(surfaceStyle, hex, mode) {
  if (surfaceStyle === 'glass') return 'linear-gradient(135deg,' + alpha(hex, mode === 'light' ? .18 : .24) + ',' + alpha('#ffffff', mode === 'light' ? .72 : .10) + ')';
  if (surfaceStyle === 'paper') return mode === 'light' ? 'rgba(255,250,240,.92)' : alpha(hex, .12);
  if (surfaceStyle === 'neon') return 'linear-gradient(135deg,' + alpha(hex, .22) + ',' + alpha('#000000', mode === 'light' ? .02 : .18) + ')';
  if (surfaceStyle === 'brutalist') return mode === 'light' ? 'rgba(255,255,255,.98)' : alpha(hex, .10);
  if (surfaceStyle === 'soft') return mode === 'light' ? alpha(hex, .14) : alpha('#ffffff', .12);
  if (surfaceStyle === 'ticket') return 'linear-gradient(135deg,' + alpha(hex, mode === 'light' ? .16 : .20) + ',' + alpha('#ffffff', mode === 'light' ? .82 : .08) + ')';
  if (surfaceStyle === 'folder') return mode === 'light' ? alpha(hex, .18) : alpha(hex, .16);
  if (surfaceStyle === 'sharp') return mode === 'light' ? 'rgba(255,255,255,.96)' : alpha(hex, .14);
  return mode === 'light' ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,.10)';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function render() {
  const snapshot = collectState();
  const warnings = buildWarnings(snapshot);
  renderPreview(snapshot, warnings);
  el.validationList.innerHTML = warnings.length
    ? warnings.map((warning) => '<div>- ' + escapeHtml(warning) + '</div>').join('')
    : '<div>- No Control Board validation warnings.</div>';
  el.jobPreview.textContent = JSON.stringify(buildSlideJob(snapshot, warnings), null, 2);
}

function refreshThemeOptions() {
  const template = currentTemplate();
  const selectedTheme = el.themeId.value || DEMO_STATE.themeId;
  const themes = CATALOG.themes.slice();
  fillSelect(el.themeId, themes, 'themeId', 'label', selectedTheme);

  const selectedSurface = el.surfaceStyle.value || DEMO_STATE.surfaceStyle;
  const allowed = CATALOG.surfaces.filter((surface) => surface.allowedUse.includes(template.slideType));
  fillSelect(el.surfaceStyle, allowed, 'id', 'label', selectedSurface);
  if (!allowed.find((surface) => surface.id === el.surfaceStyle.value)) {
    el.surfaceStyle.value = (template.allowedSurfaceStyles[0] || allowed[0].id);
  }
}

function setForm(snapshot) {
  el.projectName.value = snapshot.projectName;
  el.meetingName.value = snapshot.meetingName;
  el.requestedOutput.value = snapshot.requestedOutput;
  el.slideSize.value = snapshot.slideSize;
  el.language.value = snapshot.language;
  el.confidentiality.value = snapshot.confidentiality;
  el.templateId.value = snapshot.templateId;
  refreshThemeOptions();
  el.themeId.value = snapshot.themeId;
  el.surfaceStyle.value = snapshot.surfaceStyle;
  el.fontProfile.value = snapshot.fontProfile;
  el.animationProfile.value = snapshot.animationProfile;
  el.transition.value = snapshot.transition;
  el.density.value = snapshot.density;
  el.slideTitle.value = snapshot.slideTitle;
  el.slideSubtitle.value = snapshot.slideSubtitle;
  el.factsText.value = snapshot.factsText;
  el.warningsText.value = snapshot.warningsText;
  el.notesText.value = snapshot.notesText;
  state.sourceFiles = snapshot.sourceFiles || [];
  renderSourceFiles();
  render();
}

function renderSourceFiles() {
  if (!state.sourceFiles.length) {
    el.sourceFileList.textContent = 'No files selected yet.';
    return;
  }
  el.sourceFileList.innerHTML = state.sourceFiles.map((file) => '<div>' + escapeHtml(file.name) + ' (' + escapeHtml(file.kind) + ')</div>').join('');
}

fillSelect(el.templateId, CATALOG.templates, 'templateId', 'label', DEMO_STATE.templateId);
fillSelect(el.requestedOutput, CATALOG.outputs.map((item) => ({ id: item, label: item.replace(/_/g, ' ') })), 'id', 'label', DEMO_STATE.requestedOutput);
fillSelect(el.slideSize, CATALOG.slideSizes.map((item) => ({ id: item, label: item })), 'id', 'label', DEMO_STATE.slideSize);
fillSelect(el.language, CATALOG.languages.map((item) => ({ id: item, label: item })), 'id', 'label', DEMO_STATE.language);
fillSelect(el.confidentiality, CATALOG.confidentiality.map((item) => ({ id: item, label: item.replace(/_/g, ' ') })), 'id', 'label', DEMO_STATE.confidentiality);
fillSelect(el.fontProfile, CATALOG.fontProfiles, 'id', 'label', DEMO_STATE.fontProfile);
fillSimpleSelect(el.animationProfile, CATALOG.animationProfiles, DEMO_STATE.animationProfile);
fillSimpleSelect(el.transition, CATALOG.transitions, DEMO_STATE.transition);
fillSimpleSelect(el.density, CATALOG.densities, DEMO_STATE.density);
refreshThemeOptions();
setForm(DEMO_STATE);

[
  el.projectName, el.meetingName, el.requestedOutput, el.slideSize, el.language,
  el.confidentiality, el.templateId, el.themeId, el.surfaceStyle, el.fontProfile,
  el.animationProfile, el.transition, el.density, el.slideTitle, el.slideSubtitle,
  el.factsText, el.warningsText, el.notesText
].forEach((node) => {
  node.addEventListener('input', () => {
    if (node === el.templateId) refreshThemeOptions();
    render();
  });
  node.addEventListener('change', () => {
    if (node === el.templateId) refreshThemeOptions();
    render();
  });
});

el.sourceFiles.addEventListener('change', () => {
  const files = Array.from(el.sourceFiles.files || []);
  state.sourceFiles = files.map((file) => {
    const name = file.name;
    const ext = (name.split('.').pop() || '').toLowerCase();
    const kind = ext === 'xlsx' || ext === 'xlsm' || ext === 'xls' ? 'excel'
      : ext === 'docx' || ext === 'doc' ? 'word'
      : ext === 'pdf' ? 'pdf'
      : ext === 'pptx' || ext === 'ppt' ? 'pptx'
      : ext === 'png' || ext === 'jpg' || ext === 'jpeg' ? 'image'
      : 'file';
    return { name, kind };
  });
  renderSourceFiles();
  render();
});

el.downloadPack.addEventListener('click', () => {
  const snapshot = collectState();
  const warnings = buildWarnings(snapshot);
  const pack = buildPack(snapshot, warnings);
  Object.entries(pack).forEach(([relativePath, contents]) => {
    download(relativePath, contents, relativePath.endsWith('.json') ? 'application/json' : 'text/plain;charset=utf-8');
  });
  el.downloadNote.textContent = 'Downloaded Agent Pack files. Put them into the same project folder for the work agent.';
});

el.downloadState.addEventListener('click', () => {
  const snapshot = collectState();
  download('control_state.json', JSON.stringify(snapshot, null, 2) + '\\n', 'application/json');
  el.downloadNote.textContent = 'Downloaded control_state.json.';
});

el.loadDemo.addEventListener('click', () => {
  setForm(DEMO_STATE);
  el.downloadNote.textContent = 'Restored the demo configuration.';
});

render();
</script>
</body>
</html>
`;
}

function main() {
  const html = buildHtml();
  fs.mkdirSync(path.dirname(DIST_HTML), { recursive: true });
  fs.writeFileSync(DIST_HTML, html);

  fs.mkdirSync(PACKAGE_DIR, { recursive: true });
  fs.writeFileSync(PACKAGE_HTML, html);
  fs.writeFileSync(PACKAGE_README, [
    'SlideForge Control Board Demo',
    '============================',
    '',
    'Open control-board.html to choose a template, theme, font, shape, and prepared facts.',
    'Use the download buttons to create Agent Pack files for the weak work agent.',
    '',
    'A sample-agent-pack folder is included for reference.',
    '',
  ].join('\n'));

  writeAgentPack(path.join(PACKAGE_DIR, 'sample-agent-pack'), makeDemoState());

  console.log(`Built ${path.relative(ROOT, DIST_HTML)}`);
  console.log(`Built ${path.relative(ROOT, PACKAGE_HTML)}`);
  console.log(`Built ${path.relative(ROOT, path.join(PACKAGE_DIR, 'sample-agent-pack'))}`);
}

main();
