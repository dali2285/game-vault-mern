const fs = require('fs');
const path = require('path');
const walk = (dir) => fs.readdirSync(dir).flatMap((name) => {
  const p = path.join(dir, name);
  return fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.jsx') ? [p] : [];
});
const jsFiles = walk(process.cwd());
const jsClasses = new Set();
for (const fp of jsFiles) {
  const txt = fs.readFileSync(fp, 'utf8');
  const re = /className\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/g;
  let m;
  while ((m = re.exec(txt))) {
    const s = m[1] || m[2] || m[3];
    if (s) s.split(/\s+/).filter(Boolean).forEach((c) => jsClasses.add(c));
  }
}
const css = fs.readFileSync(path.join(process.cwd(), 'src', 'styles.css'), 'utf8');
const cssClasses = new Set();
for (const line of css.split(/\r?\n/)) {
  const m = line.match(/^[ \t]*\.([a-zA-Z0-9_-]+)/);
  if (m) cssClasses.add(m[1]);
}
const missingInCss = [...jsClasses].sort().filter((c) => !cssClasses.has(c));
const missingInJs = [...cssClasses].sort().filter((c) => !jsClasses.has(c));
console.log('---MISSING_IN_CSS---');
console.log(missingInCss.join('\n'));
console.log('---MISSING_IN_JS---');
console.log(missingInJs.join('\n'));
