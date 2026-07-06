#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { makeDemoState, writeAgentPack } = require('./lib/agent_pack');

function usage() {
  console.log('Usage: node tools/create_agent_pack.js --config <control_state.json> --out <folder>');
  console.log('   or: node tools/create_agent_pack.js --demo --out <folder>');
}

function main() {
  const args = process.argv.slice(2);
  const opt = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : null;
  };

  const outDir = opt('--out') || opt('-o');
  const configPath = opt('--config');
  const useDemo = args.includes('--demo');

  if (!outDir || (!configPath && !useDemo)) {
    usage();
    process.exit(1);
  }

  let input;
  if (useDemo) {
    input = makeDemoState();
  } else {
    const full = path.resolve(configPath);
    if (!fs.existsSync(full)) {
      console.error(`Control state file not found: ${configPath}`);
      process.exit(1);
    }
    try {
      input = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (error) {
      console.error(`Control state file is not valid JSON: ${error.message}`);
      process.exit(1);
    }
  }

  const result = writeAgentPack(outDir, input);
  console.log(`Agent Pack created at ${result.outDir}`);
  result.files.forEach((file) => console.log(`- ${file}`));
}

main();
