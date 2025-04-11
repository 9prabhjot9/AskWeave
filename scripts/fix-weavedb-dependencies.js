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

// Fixed content for utils.js - completely replace the file
const fixedContent = `// Fixed utils.js file for WeaveDB
function hexToNumber(hex) {
  if (typeof hex !== "string") {
    throw new Error("string required, got: " + typeof hex)
  }
  // Big Endian
  return BigInt("0x" + hex)
}

function numberToHex(num, padToBytes = 0) {
  if (
    typeof num !== "bigint" &&
    (typeof num !== "number" || (num < 0 || !Number.isSafeInteger(num)))
  )
    throw new Error("bigint or positive safe integer required, got: " + typeof num)

  let hex = num.toString(16)
  if (padToBytes > 0) {
    hex = hex.padStart(padToBytes * 2, "0")
  }
  return hex.length % 2 ? "0" + hex : hex
}

// Utilities from noble-hashes
function u8a(a) {
  return a instanceof Uint8Array
}

// For faster byte<->hex conversion.
// Chars length is 16, to process .charCodeAt(i) & 15 = 0..15
const hexes = Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, "0")
)

function asciiToBase16(char) {
  if (char >= 48 && char <= 57) return char - 48 // 0-9
  if (char >= 65 && char <= 70) return char - 65 + 10 // A-F
  if (char >= 97 && char <= 102) return char - 97 + 10 // a-f
  return
}

function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex)
  const hl = hex.length
  const al = hl / 2
  if (hl % 2)
    throw new Error(
      "padded hex string expected, got unpadded hex of length " + hl
    )
  const array = new Uint8Array(al)
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi))
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1))
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1]
      throw new Error(
        'hex string expected, got non-hex character "' +
          char +
          '" at index ' +
          hi
      )
    }
    array[ai] = n1 * 16 + n2
  }
  return array
}

function bytesToHex(bytes) {
  if (!u8a(bytes)) throw new Error("Uint8Array expected")
  let hex = ""
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]]
  }
  return hex
}

function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes))
}

function bytesToNumberLE(bytes) {
  if (!u8a(bytes)) throw new Error("Uint8Array expected")
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()))
}

function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"))
}

function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse()
}

function concatBytes(...arrays) {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0))
  let pad = 0 // walk through each item, ensure they have proper type
  arrays.forEach(a => {
    if (!u8a(a)) throw new Error("Uint8Array expected")
    r.set(a, pad)
    pad += a.length
  })
  return r
}

function ensureBytes(title, hex, expectedLength) {
  let res
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex)
    } catch (e) {
      throw new Error(
        \`\${title} must be valid hex string, got "\${hex}". Cause: \${e}\`
      )
    }
  } else if (u8a(hex)) {
    // Uint8Array.from() instead of hash.slice() because node.js Buffer
    // is instance of Uint8Array, and its slice() creates **mutable** copy
    res = Uint8Array.from(hex)
  } else {
    throw new Error(\`\${title} must be hex string or Uint8Array\`)
  }
  const len = res.length
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(\`\${title} expected \${expectedLength} bytes, got \${len}\`)
  return res
}

const validatorFns = {
  bigint: val => typeof val === "bigint",
  function: val => typeof val === "function",
  boolean: val => typeof val === "boolean",
  string: val => typeof val === "string",
  stringOrUint8Array: val =>
    typeof val === "string" || val instanceof Uint8Array,
  isSafeInteger: val => Number.isSafeInteger(val),
  array: val => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: val => typeof val === "function" && Number.isSafeInteger(val.outputLen),
}

function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type]
    if (typeof checkVal !== "function")
      throw new Error(\`Invalid validator "\${type}", expected function\`)

    const val = object[fieldName]
    if (isOptional && val === undefined) return
    if (!checkVal(val, object)) {
      throw new Error(
        \`Invalid param \${String(
          fieldName
        )}=\${val} (\${typeof val}), expected \${type}\`
      )
    }
  }
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false)
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true)
  return object
}

module.exports = {
  hexToNumber,
  numberToHex,
  u8a,
  hexes,
  asciiToBase16,
  hexToBytes,
  bytesToHex,
  bytesToNumberBE,
  bytesToNumberLE,
  numberToBytesBE,
  numberToBytesLE,
  concatBytes,
  ensureBytes,
  validatorFns,
  validateObject
};`;

// Write fixed content to file
fs.writeFileSync(utilsFilePath, fixedContent, 'utf8');

console.log('Fixed WeaveDB utils file:', utilsFilePath);

// Check for .env.local file and create it if needed
const envFilePath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envFilePath)) {
  console.log('Creating .env.local file...');
  fs.writeFileSync(envFilePath, '# Environment variables for AskWeave\n', 'utf8');
}

console.log('✅ WeaveDB dependencies fixed successfully!');
console.log('');
console.log('Next steps:');
console.log('1. For development with localStorage: node scripts/mock-deploy.js');
console.log('2. For deployment to Arweave:');
console.log('   a. Generate wallet: node scripts/generate-wallet.js');
console.log('   b. Fund wallet with AR tokens');
console.log('   c. Deploy to Arweave: node scripts/deploy-weavedb.js');