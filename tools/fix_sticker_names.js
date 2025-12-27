const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const tsFilePath = path.join(__dirname, '../src/data/stickerMasterData.ts');
let tsContent = fs.readFileSync(tsFilePath, 'utf-8');

// Track character counts for sequential numbering
const characterCounts = {};

// Function to get the next number for a character
function getNextNumber(character) {
  if (!characterCounts[character]) {
    characterCounts[character] = 0;
  }
  characterCounts[character]++;
  return characterCounts[character];
}

// We need to process line by line to maintain order
// Handle both CRLF and LF line endings
const lines = tsContent.split(/\r?\n/);
const newLines = [];

for (const line of lines) {
  // Match name lines with various formats
  // name: 'キャラ名 ボンドロ#数字', or name: 'キャラ名 マシュマロ#数字',
  const nameMatch = line.match(/^(\s*name:\s*')([^']+)\s+(ボンドロ|マシュマロ)#(\d+)(',?.*)$/);
  
  if (nameMatch) {
    const [, prefix, character, variantType, oldNum, suffix] = nameMatch;
    const newNumber = getNextNumber(character);
    const newLine = `${prefix}${character} #${newNumber}${suffix}`;
    newLines.push(newLine);
  } else {
    newLines.push(line);
  }
}

// Write back with original line ending style (CRLF for Windows)
fs.writeFileSync(tsFilePath, newLines.join('\r\n'), 'utf-8');
console.log('TypeScript file updated!');
console.log('Total characters:', Object.keys(characterCounts).length);
console.log('Sample counts:', Object.entries(characterCounts).slice(0, 5));
console.log('Total stickers renamed:', Object.values(characterCounts).reduce((a,b) => a+b, 0));

// Now update the SQL migration file
const sqlFilePath = path.join(__dirname, '../supabase/migrations/024_seed_all_stickers.sql');
if (fs.existsSync(sqlFilePath)) {
  let sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
  
  // Reset counts for SQL
  const sqlCharCounts = {};
  function getSqlNextNumber(character) {
    if (!sqlCharCounts[character]) {
      sqlCharCounts[character] = 0;
    }
    sqlCharCounts[character]++;
    return sqlCharCounts[character];
  }
  
  // Pattern in SQL: 'キャラ名 ボンドロ#数字' or 'キャラ名 マシュマロ#数字'
  // Use a function replacer to handle sequential numbering
  sqlContent = sqlContent.replace(/'([^']+)\s+(ボンドロ|マシュマロ)#(\d+)'/g, (match, character, variantType, oldNum) => {
    const newNumber = getSqlNextNumber(character);
    return `'${character} #${newNumber}'`;
  });
  
  fs.writeFileSync(sqlFilePath, sqlContent, 'utf-8');
  console.log('\nSQL migration file updated!');
  console.log('Total SQL characters:', Object.keys(sqlCharCounts).length);
  console.log('Total SQL stickers renamed:', Object.values(sqlCharCounts).reduce((a,b) => a+b, 0));
}
