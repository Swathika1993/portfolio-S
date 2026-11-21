import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const profilePath = path.join(rootDir, 'content', 'profile.txt');
const outputDir = path.join(rootDir, 'src', 'generated');
const outputPath = path.join(outputDir, 'profile.json');

try {
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Profile file missing at: ${profilePath}`);
  }

  const raw = fs.readFileSync(profilePath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  const data = {
    profile: {},
    bio: [],
    socials: [],
    projects: [],
    expertise: [],
    blogs: []
  };

  let currentSection = '';
  let currentItem = null;

  function flushItem() {
    if (!currentItem) return;

    if (currentSection === 'PROJECTS' && (currentItem.title || currentItem.description)) {
      data.projects.push({
        title: currentItem.title || '',
        description: currentItem.description || '',
        image: currentItem.image || '',
        url: currentItem.url || '',
        metric: currentItem.metric || '',
        tags: currentItem.tags
          ? currentItem.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : []
      });
    } else if (currentSection === 'EXPERTISE' && (currentItem.title || currentItem.summary)) {
      data.expertise.push({
        title: currentItem.title || '',
        summary: currentItem.summary || '',
        focus: currentItem.focus
          ? currentItem.focus.split(',').map(focus => focus.trim()).filter(Boolean)
          : []
      });
    } else if (currentSection === 'BLOGS' && (currentItem.title || currentItem.summary)) {
      data.blogs.push({
        title: currentItem.title || '',
        summary: currentItem.summary || '',
        url: currentItem.url || '',
        tag: currentItem.tag || ''
      });
    }

    currentItem = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('===')) {
      const match = line.match(/^===\s*([A-Z_]+)\s*===$/);
      if (match) {
        flushItem();
        currentSection = match[1];
        continue;
      }
    }

    if (currentSection === 'PROFILE') {
      const parts = line.split('=');
      if (parts.length >= 2) {
        data.profile[parts[0].trim()] = parts.slice(1).join('=').trim();
      }
    } else if (currentSection === 'BIO') {
      data.bio.push(line);
    } else if (currentSection === 'SOCIALS') {
      const parts = line.split('|').map(s => s.trim());
      if (parts.length >= 2) {
        data.socials.push({ label: parts[0], url: parts[1] });
      }
    } else if (currentSection === 'PROJECTS' || currentSection === 'EXPERTISE' || currentSection === 'BLOGS') {
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        const value = line.slice(eqIdx + 1).trim();
        if (!currentItem || Object.prototype.hasOwnProperty.call(currentItem, key)) {
          flushItem();
          currentItem = {};
        }
        currentItem[key] = value;
      } else if (currentSection === 'PROJECTS') {
        const parts = line.split('|').map(part => part.trim());
        if (parts.length >= 5) {
          flushItem();
          data.projects.push({
            title: parts[0],
            description: parts[1],
            image: parts[2],
            url: parts[3],
            metric: '',
            tags: parts[4].split(',').map(tag => tag.trim()).filter(Boolean)
          });
        }
      }
    }
  }

  flushItem();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✓ Profile parsed successfully into src/generated/profile.json');
} catch (err) {
  console.error('Build failure during parse:', err.message);
  process.exit(1);
}