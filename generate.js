const fs = require('fs');
const path = require('path');

const TEMPLATE = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const IDS_FILE = path.join(__dirname, 'ids.txt');
const OUT_DIR = path.join(__dirname, 'docs', 'projects');

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

if (!fs.existsSync(IDS_FILE)) {
  console.error('ids.txt not found. Create ids.txt with one project id per line.');
  process.exit(1);
}

const ids = fs.readFileSync(IDS_FILE, 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean);

if (!ids.length) {
  console.error('No ids found in ids.txt');
  process.exit(1);
}

for (const rawId of ids) {
  const id = escapeHtml(rawId);
  const outPath = path.join(OUT_DIR, id);
  fs.mkdirSync(outPath, { recursive: true });

  // Update this to your Pages URL later (used as og:url). Using your repo's Pages URL by default
  const embedPageUrl = `https://this-username-is-no-longer-allowed.github.io/scratch-project-embed-og/projects/${encodeURIComponent(id)}/`;

  // Scratch thumbnail pattern
  const thumb = `https://uploads.scratch.mit.edu/internalapi/thumbnail/project/${encodeURIComponent(id)}_480x360.png`;

  const contents = TEMPLATE
    .replace(/{{ID}}/g, id)
    .replace(/{{URL}}/g, embedPageUrl)
    .replace(/{{IMAGE}}/g, thumb);

  fs.writeFileSync(path.join(outPath, 'index.html'), contents, 'utf8');
  console.log('Generated for', id);
}
console.log('All done. Generated', ids.length, 'pages into', OUT_DIR);
