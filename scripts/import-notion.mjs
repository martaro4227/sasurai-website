#!/usr/bin/env node
import fs from 'fs';
import process from 'process';
import { Client } from '@notionhq/client';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { updateTitle: false };
  for (let i = 0; i < args.length; i++) {
    const k = args[i];
    const v = args[i + 1];
    if (k === '--page') out.pageId = v;
    if (k === '--file') out.file = v;
    if (k === '--update-title') out.updateTitle = true;
  }
  if (!out.pageId || !out.file) {
    console.error('Usage: node scripts/import-notion.mjs --page <pageId> --file <targetHtml> [--update-title]');
    process.exit(1);
  }
  return out;
}

function toPlain(rich = []) {
  return rich.map(t => t.plain_text).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function blockToHtml(block) {
  const { type } = block;
  switch (type) {
    case 'heading_1': {
      const text = toPlain(block.heading_1.rich_text);
      return `<h2>${escapeHtml(text)}</h2>`;
    }
    case 'heading_2': {
      const text = toPlain(block.heading_2.rich_text);
      return `<h3>${escapeHtml(text)}</h3>`;
    }
    case 'heading_3': {
      const text = toPlain(block.heading_3.rich_text);
      return `<h4>${escapeHtml(text)}</h4>`;
    }
    case 'paragraph': {
      const text = toPlain(block.paragraph.rich_text);
      return text.trim().length ? `<p>${escapeHtml(text)}</p>` : '';
    }
    case 'bulleted_list_item': {
      const text = toPlain(block.bulleted_list_item.rich_text);
      return `<li>${escapeHtml(text)}</li>`;
    }
    case 'numbered_list_item': {
      const text = toPlain(block.numbered_list_item.rich_text);
      return `<li>${escapeHtml(text)}</li>`;
    }
    case 'quote': {
      const text = toPlain(block.quote.rich_text);
      return `<blockquote>${escapeHtml(text)}</blockquote>`;
    }
    case 'callout': {
      const text = toPlain(block.callout.rich_text);
      return `<div class="note">${escapeHtml(text)}</div>`;
    }
    case 'divider': return '<hr />';
    default: return '';
  }
}

function assembleListHtml(blocks) {
  // Merge consecutive list items into <ul>/<ol>
  const html = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'bulleted_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(blockToHtml(blocks[i]));
        i++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (b.type === 'numbered_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blockToHtml(blocks[i]));
        i++;
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }
    html.push(blockToHtml(b));
    i++;
  }
  return html.join('\n');
}

async function fetchAllBlocks(notion, blockId) {
  const out = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
    out.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return out;
}

async function main() {
  const { pageId, file, updateTitle } = parseArgs();
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.error('ERROR: NOTION_API_KEY is not set');
    process.exit(1);
  }
  const notion = new Client({ auth: apiKey });

  // Page metadata
  const page = await notion.pages.retrieve({ page_id: pageId });
  let pageTitle = '';
  if (page.properties) {
    const titleProp = Object.values(page.properties).find(p => p.type === 'title');
    if (titleProp) pageTitle = toPlain(titleProp.title || []);
  }

  // Blocks
  const blocks = await fetchAllBlocks(notion, pageId);
  const contentHtml = assembleListHtml(blocks);

  // Read target file
  const html = fs.readFileSync(file, 'utf8');
  const startMarker = '<!-- START_NOTION_CONTENT -->';
  const endMarker = '<!-- END_NOTION_CONTENT -->';
  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    console.error('Markers not found in target HTML');
    process.exit(1);
  }

  // Build TOC from h2 within the imported content
  const h2Matches = Array.from(contentHtml.matchAll(/<h2>([^<]+)<\/h2>/g));
  const tocItems = h2Matches.map((m, idx) => {
    const text = m[1];
    const id = `sec${idx + 1}`;
    return { id, text };
  });
  let contentWithIds = contentHtml;
  h2Matches.forEach((m, idx) => {
    const id = `sec${idx + 1}`;
    contentWithIds = contentWithIds.replace(m[0], `<h2 id="${id}">${m[1]}</h2>`);
  });

  // Replace content
  const before = html.slice(0, startIdx + startMarker.length);
  const after = html.slice(endIdx);
  let next = `${before}\n${contentWithIds}\n${after}`;

  // Update inline TOC list items
  next = next.replace(/<ul class="h2list">[\s\S]*?<\/ul>/, () => {
    const items = tocItems.map(i => `<li><a class="tocLink" href="#${i.id}"><span>${escapeHtml(i.text)}</span></a></li>`).join('');
    return `<ul class="h2list">${items}</ul>`;
  });

  // Optionally update the top title and banner text
  if (updateTitle && pageTitle) {
    next = next.replace(/<h1 class="title">[\s\S]*?<\/h1>/, `<h1 class="title">${escapeHtml(pageTitle)}</h1>`);
    next = next.replace(/<figure class="eyecatch">[\s\S]*?<\/figure>/, `<figure class="eyecatch"><div class="banner"><h2>${escapeHtml(pageTitle)}</h2></div></figure>`);
  }

  fs.writeFileSync(file, next, 'utf8');
  console.log('Imported Notion page into', file);
}

main().catch(err => { console.error(err); process.exit(1); }); 