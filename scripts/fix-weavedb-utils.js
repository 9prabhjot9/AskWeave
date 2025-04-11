#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to the problematic file
const utilsFilePath = path.resolve(
  __dirname,
  '../node_modules/weavedb-contracts/nostr/lib/abstract/utils.js'
);

// Check if file exists
if (!fs.existsSync(utilsFilePath)) {
  console.error('Target file does not exist:', utilsFilePath);
  process.exit(1);
}

// Read file content
const content = fs.readFileSync(utilsFilePath, 'utf8');
const lines = content.split('\n');

// Create a new array to store fixed content
const fixedLines = [];

// Track functions we've seen
const seenFunctions = new Set();
// Flag to indicate if we're currently skipping a function
let skipping = false;
// Count braces to properly detect function end
let braceCount = 0;

// Process each line
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Check for function declarations we need to deduplicate
  if (line.startsWith('function bytesToHex(') || line.startsWith('function hexToBytes(')) {
    const functionName = line.startsWith('function bytesToHex') ? 'bytesToHex' : 'hexToBytes';
    
    if (seenFunctions.has(functionName)) {
      // We've seen this function before, skip it
      console.log(`Removing duplicate function: ${functionName}`);
      skipping = true;
      braceCount = 0; // Reset brace count
      fixedLines.push(`// Duplicate ${functionName} function removed`);
      continue;
    } else {
      seenFunctions.add(functionName);
    }
  }
  
  // If we're skipping a function, count braces to know when it ends
  if (skipping) {
    for (const char of lines[i]) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    // If we've matched all braces, stop skipping
    if (braceCount <= 0 && lines[i].includes('}')) {
      skipping = false;
      continue;
    }
    
    continue; // Skip this line
  }
  
  // Add non-skipped lines to output
  fixedLines.push(lines[i]);
}

// Write fixed content back to file
fs.writeFileSync(utilsFilePath, fixedLines.join('\n'), 'utf8');

console.log('Fixed duplicate function definitions in:', utilsFilePath); 