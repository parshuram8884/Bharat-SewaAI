import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/pages/benefits').map(f => path.join('src/pages/benefits', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
});
console.log('Fixed escape sequences in benefits pages.');
