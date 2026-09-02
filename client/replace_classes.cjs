const fs = require('fs');
const path = require('path');

const replacements = {
  'primary-green': 'brand-primary',
  'deep-forest': 'brand-dark',
  'soft-beige': 'brand-light',
  'soft-sage': 'brand-light',
  'terracotta': 'danger-tag',
  'secondary-text': 'text-muted',
  'dark-text': 'text-main',
  'border-color': 'border-subtle'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [oldClass, newClass] of Object.entries(replacements)) {
        const regex = new RegExp(oldClass, 'g');
        content = content.replace(regex, newClass);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('d:/Clothing Exchange & Swap Marketplace/client/src');
