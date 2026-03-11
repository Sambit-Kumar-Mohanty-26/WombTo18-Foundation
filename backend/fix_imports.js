const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modules = ['admin', 'auth', 'blog', 'certificate', 'donation', 'donor', 'prisma', 'program'];

function replaceInFile(filePath, regex, replacement) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

for (const m of modules) {
  const modFile = path.join(srcDir, m, `${m}.module.ts`);
  replaceInFile(modFile, new RegExp(`from '\\./${m}\\.controller'`, 'g'), `from './controllers/${m}.controller'`);
  replaceInFile(modFile, new RegExp(`from '\\./${m}\\.service'`, 'g'), `from './services/${m}.service'`);
  
  const ctrlDir = path.join(srcDir, m, 'controllers');
  if (fs.existsSync(ctrlDir)) {
    const files = fs.readdirSync(ctrlDir);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const fp = path.join(ctrlDir, file);
        replaceInFile(fp, new RegExp(`from '\\./${m}\\.service'`, 'g'), `from '../services/${m}.service'`);
        replaceInFile(fp, /from '\.\.\/prisma\/prisma\.service'/g, "from '../../prisma/services/prisma.service'");
        replaceInFile(fp, /from '\.\.\/auth\/auth\.service'/g, "from '../../auth/services/auth.service'");
      }
    }
  }

  const svcDir = path.join(srcDir, m, 'services');
  if (fs.existsSync(svcDir)) {
    const files = fs.readdirSync(svcDir);
    for (const file of files) {
      if (file.endsWith('.ts')) {
        const fp = path.join(svcDir, file);
        replaceInFile(fp, /from '\.\.\/prisma\/prisma\.service'/g, "from '../../prisma/services/prisma.service'");
        replaceInFile(fp, /from '\.\.\/auth\/auth\.service'/g, "from '../../auth/services/auth.service'");
      }
    }
  }
}

console.log('Fixed imports');
