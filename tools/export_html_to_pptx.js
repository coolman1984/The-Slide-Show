#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;

function usage() {
  console.error('Usage: node tools/export_html_to_pptx.js <input.html> -o <output.pptx>');
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const opt = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : null;
  };
  const input = args.find((arg, index) => !arg.startsWith('-') && args[index - 1] !== '-o' && args[index - 1] !== '--out');
  const output = opt('-o') || opt('--out');
  if (!input || !output) {
    usage();
    process.exit(1);
  }
  return {
    inputPath: path.resolve(ROOT, input),
    outputPath: path.resolve(ROOT, output),
  };
}

function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No local Edge or Chrome executable found for HTML rendering.');
  return found;
}

function countSlides(html) {
  const matches = html.match(/<section\s+class="[^"]*\bslide\b[^"]*"/g) || [];
  return matches.length;
}

function buildSlideHtml(html, activeIndex) {
  let index = 0;
  const htmlWithActiveSlide = html.replace(/<section\s+class="([^"]*\bslide\b[^"]*)"([^>]*)>/g, (match, className, rest) => {
    const cleaned = className
      .split(/\s+/)
      .filter((name) => !['active', 'leaving', 'play'].includes(name))
      .join(' ');
    const nextClass = index === activeIndex ? `${cleaned} active play` : cleaned;
    index += 1;
    return `<section class="${nextClass}"${rest}>`;
  });

  const exportCss = `
<style id="pptx-export-css">
  #chrome { display: none !important; }
  .slide { transition: none !important; }
  .slide:not(.active) { opacity: 0 !important; visibility: hidden !important; }
  .slide.active { opacity: 1 !important; visibility: visible !important; transform: none !important; }
  .a { opacity: 1 !important; animation: none !important; transform: none !important; }
</style>`;

  return htmlWithActiveSlide.replace('</head>', `${exportCss}\n</head>`);
}

function runOrThrow(command, args, label) {
  const result = childProcess.spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed.\n${result.stdout || ''}${result.stderr || ''}`.trim());
  }
}

function renderSlides(inputPath, workDir) {
  const browser = findBrowser();
  const html = fs.readFileSync(inputPath, 'utf8');
  const slideCount = countSlides(html);
  if (!slideCount) throw new Error('No slide sections found in HTML.');

  const images = [];
  for (let i = 0; i < slideCount; i++) {
    const slideHtml = buildSlideHtml(html, i);
    const tempHtml = path.join(workDir, `slide-${String(i + 1).padStart(2, '0')}.html`);
    const imagePath = path.join(workDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(tempHtml, slideHtml);

    runOrThrow(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${STAGE_WIDTH},${STAGE_HEIGHT}`,
      `--screenshot=${imagePath}`,
      `file:///${tempHtml.replace(/\\/g, '/')}`,
    ], `Render slide ${i + 1}`);

    if (!fs.existsSync(imagePath) || fs.statSync(imagePath).size < 1000) {
      throw new Error(`Rendered image is missing or too small: ${imagePath}`);
    }
    images.push(imagePath);
  }
  return images;
}

function psString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function createPptx(images, outputPath, workDir) {
  const psPath = path.join(workDir, 'create-pptx.ps1');
  const imageArray = images.map(psString).join(', ');
  const script = `
$ErrorActionPreference = 'Stop'
$images = @(${imageArray})
$output = ${psString(outputPath)}
$ppt = New-Object -ComObject PowerPoint.Application
$presentation = $ppt.Presentations.Add()
$presentation.PageSetup.SlideWidth = 960
$presentation.PageSetup.SlideHeight = 540
foreach ($image in $images) {
  $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, 12)
  [void]$slide.Shapes.AddPicture($image, 0, -1, 0, 0, 960, 540)
}
if (Test-Path -LiteralPath $output) { Remove-Item -LiteralPath $output -Force }
$presentation.SaveAs($output)
$presentation.Close()
$ppt.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
`;
  fs.writeFileSync(psPath, script);
  runOrThrow('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psPath], 'Create PPTX');
}

function main() {
  const { inputPath, outputPath } = parseArgs(process.argv);
  if (!fs.existsSync(inputPath)) throw new Error(`Input HTML not found: ${inputPath}`);

  const workDir = path.join(ROOT, 'dist', '.pptx-export');
  fs.rmSync(workDir, { recursive: true, force: true });
  fs.mkdirSync(workDir, { recursive: true });

  const images = renderSlides(inputPath, workDir);
  createPptx(images, outputPath, workDir);

  const relOut = path.relative(ROOT, outputPath);
  console.log(`Created ${relOut} from ${images.length} rendered slides.`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
