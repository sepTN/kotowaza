# Kotowaza — Japanese Proverbs Dataset 📚

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/kotowaza.svg)](https://www.npmjs.com/package/kotowaza)
[![NPM Downloads](https://img.shields.io/npm/dm/kotowaza.svg)](https://www.npmjs.com/package/kotowaza)

**Kotowaza** is a structured, production-grade dataset of **Japanese proverbs (ことわざ)** with bilingual meanings, JLPT levels, example sentences, thematic tags, and cross-language equivalents.

It is designed for developers, educators, linguists, and language apps that need a clean, searchable **Japanese proverb database API or JSON dataset**.

> ⚡️ **Live Demo:** This dataset powers the **[Kamus Peribahasa Jepang](https://jepang.org/peribahasa/)** on **[Jepang.org](https://jepang.org)** — Indonesia's comprehensive Japanese learning platform. See it running in production!

- **Repository:** [github.com/sepTN/kotowaza](https://github.com/sepTN/kotowaza)
- **Documentation:** [septn.github.io/kotowaza](https://septn.github.io/kotowaza/)
- **Website:** [Jepang.org — Belajar Bahasa Jepang](https://jepang.org)

Most proverb datasets are:
- incomplete
- monolingual
- unstructured
- hard to search programmatically

**Kotowaza fixes that** with a normalized schema, multilingual meanings, and production-ready helper functions so you can plug proverb wisdom into apps instantly.

## Features

*   📖 **Bilingual Meanings** — Each entry includes explanations in **Indonesian** and **English**
*   🈁 **Complete Readings** — Hiragana (reading), romaji, and original kanji
*   📝 **Example Sentences** — Real-world usage with Japanese, romaji, and Indonesian translation
*   🏷️ **Thematic Tags** — Categorized by theme (animals, life, money, relationships, etc.)
*   📊 **JLPT Levels** — Entries tagged with JLPT N5–N1 difficulty levels
*   🔗 **Related Proverbs** — Cross-references to similar or related kotowaza
*   🌐 **Equivalent Proverbs** — Matching proverbs in Indonesian and English
*   ⚡ **Zero Dependencies** — Pure JSON data with lightweight query helpers
*   🔍 **Built-in Search** — Search across all text fields instantly

## Installation

```bash
npm install kotowaza
```

## Quick Start

```javascript
const kotowaza = require('kotowaza');

// Get all entries
const all = kotowaza.all();
console.log(`Loaded ${kotowaza.count()} proverbs`);

// Look up a specific proverb by ID
const entry = kotowaza.get('nanakorobi-yaoki');
console.log(entry.japanese);    // 七転び八起き
console.log(entry.meaning.en);  // No matter how many times you fail...

// Search across all fields (Japanese, romaji, or meaning)
kotowaza.search('猿');           // → entries containing 猿
kotowaza.search('monkey');       // → entries with "monkey" in English

// Filter by theme tag
kotowaza.byTag('motivation');    // → motivational proverbs
kotowaza.byTag('animals');       // → animal-related proverbs

// Filter by Indonesian tag
kotowaza.byTagId('motivasi');    // → same as byTag('motivation')

// Filter by JLPT level
kotowaza.byJlpt('N3');          // → proverbs suitable for N3

// Get a random proverb (great for "Quote of the Day" features!)
const daily = kotowaza.random();
console.log(`${daily.japanese} — ${daily.meaning.id}`);

// Get all available tags and JLPT levels
kotowaza.tags();                 // → ['animals', 'business', 'culture', ...]
kotowaza.tagsId();               // → ['angka', 'bisnis', 'budaya', ...]
kotowaza.jlptLevels();           // → ['N2', 'N3', 'N4']

// Generate a link to the full article on Jepang.org
kotowaza.url('nanakorobi-yaoki');
// → https://jepang.org/peribahasa/nanakorobi-yaoki/
```

## Examples

### 📅 Quote of the Day

```javascript
const kotowaza = require('kotowaza');

// Deterministic "daily" proverb based on the date
function getDailyProverb() {
    const all = kotowaza.all();
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % all.length;
    return all[dayIndex];
}

const daily = getDailyProverb();
console.log(`📜 ${daily.japanese}`);
console.log(`💬 ${daily.meaning.en}`);
// 📜 七転び八起き
// 💬 No matter how many times you fail, never give up...
```

### 🌐 Express API Endpoint

```javascript
const express = require('express');
const kotowaza = require('kotowaza');
const app = express();

// GET /api/proverbs?tag=motivation&jlpt=N3
app.get('/api/proverbs', (req, res) => {
    let results = kotowaza.all();

    if (req.query.tag) {
        results = kotowaza.byTag(req.query.tag);
    }
    if (req.query.jlpt) {
        results = results.filter(e => e.jlpt === req.query.jlpt.toUpperCase());
    }
    if (req.query.q) {
        results = kotowaza.search(req.query.q);
    }

    res.json({ count: results.length, data: results });
});

// GET /api/proverbs/random
app.get('/api/proverbs/random', (req, res) => {
    res.json(kotowaza.random());
});

// GET /api/proverbs/:id
app.get('/api/proverbs/:id', (req, res) => {
    const entry = kotowaza.get(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
});
```

### 🎓 JLPT Study Flashcards

```javascript
const kotowaza = require('kotowaza');

// Build a study deck for a specific JLPT level
function buildStudyDeck(level) {
    return kotowaza.byJlpt(level).map(entry => ({
        front: entry.japanese,
        hint: entry.reading,
        back: entry.meaning.en,
        example: entry.examples[0]?.ja,
        url: kotowaza.url(entry.id)
    }));
}

const n3Deck = buildStudyDeck('N3');
console.log(`📚 ${n3Deck.length} flashcards for JLPT N3`);

// Shuffle and quiz
const card = n3Deck[Math.floor(Math.random() * n3Deck.length)];
console.log(`Q: What does "${card.front}" mean?`);
console.log(`A: ${card.back}`);
```

### 🔎 Search Autocomplete

```javascript
const kotowaza = require('kotowaza');

// Lightweight search for autocomplete / typeahead
function autocomplete(query) {
    if (!query || query.length < 2) return [];

    return kotowaza.search(query).slice(0, 5).map(entry => ({
        id: entry.id,
        label: `${entry.japanese} (${entry.romaji})`,
        preview: entry.meaning.en.slice(0, 60) + '...'
    }));
}

console.log(autocomplete('fall'));
// [{ id: 'nanakorobi-yaoki', label: '七転び八起き (Nanakorobi Yaoki)', preview: '...' }]
```

### 🤖 Discord / Slack Bot

```javascript
const kotowaza = require('kotowaza');

// !kotowaza — random proverb
function handleCommand(command, args) {
    if (command === '!kotowaza') {
        const entry = args[0] ? kotowaza.get(args[0]) : kotowaza.random();
        if (!entry) return '❌ Proverb not found.';

        return [
            `**${entry.japanese}** (${entry.romaji})`,
            `> _${entry.meaning.en}_`,
            entry.equivalent?.en ? `🔗 Similar: "${entry.equivalent.en}"` : '',
            `📖 ${kotowaza.url(entry.id)}`
        ].filter(Boolean).join('\n');
    }

    // !kotowaza-quiz — quiz mode
    if (command === '!kotowaza-quiz') {
        const entry = kotowaza.random();
        return `❓ What does **"${entry.japanese}"** mean?\n||${entry.meaning.en}||`;
    }
}
```

### 🏗️ Static Site Generator (11ty / Hugo / Astro)

```javascript
const kotowaza = require('kotowaza');

// Generate pages for each proverb (e.g. in 11ty .eleventy.js)
module.exports = function(eleventyConfig) {
    eleventyConfig.addCollection('proverbs', () => {
        return kotowaza.all().map(entry => ({
            ...entry,
            permalink: `/proverbs/${entry.id}/`,
            fullUrl: kotowaza.url(entry.id)
        }));
    });

    // Shortcode for embedding a random proverb
    eleventyConfig.addShortcode('randomProverb', () => {
        const p = kotowaza.random();
        return `<blockquote class="kotowaza">
            <p lang="ja">${p.japanese}</p>
            <footer>${p.meaning.en}</footer>
        </blockquote>`;
    });
};
```

## API Reference

| Method | Returns | Description |
| :--- | :--- | :--- |
| `all()` | `object[]` | Returns all kotowaza entries |
| `get(id)` | `object\|null` | Get a single entry by its slug ID |
| `search(query)` | `object[]` | Search across Japanese text, romaji, and meanings |
| `byTag(tag)` | `object[]` | Filter entries by thematic tag (English) |
| `byTagId(tag)` | `object[]` | Filter entries by Indonesian tag |
| `byJlpt(level)` | `object[]` | Filter entries by JLPT level (e.g. `'N3'`) |
| `random()` | `object` | Returns one random entry |
| `count()` | `number` | Total number of entries |
| `tags()` | `string[]` | All unique tags in English, sorted |
| `tagsId()` | `string[]` | All unique tags in Indonesian, sorted |
| `jlptLevels()` | `string[]` | All JLPT levels present in the dataset |
| `url(id)` | `string` | Full URL to the entry on [Jepang.org](https://jepang.org/peribahasa/) |

## Data Schema

Each entry follows this structure:

```jsonc
{
  "id": "nanakorobi-yaoki",        // URL slug (matches jepang.org URL)
  "japanese": "七転び八起き",         // Original Japanese (kanji)
  "reading": "ななころびやおき",       // Hiragana reading
  "romaji": "Nanakorobi Yaoki",     // Romanized reading
  "literal": "Fall seven times, rise eight times", // Literal translation
  "meaning": {
    "id": "Indonesian meaning...",  // Meaning in Bahasa Indonesia
    "en": "English meaning..."      // Meaning in English
  },
  "tags": ["motivation", "numbers"],  // Thematic tags (English)
  "tags_id": ["motivasi", "angka"],   // Thematic tags (Indonesian)
  "jlpt": "N4",                     // JLPT level (or null)
  "equivalent": {
    "id": "Padanan peribahasa Indonesia...",
    "en": "Equivalent English proverb..."
  },
  "examples": [                     // Example sentences
    {
      "ja": "Japanese sentence...",
      "romaji": "Romanized sentence...",
      "id": "Indonesian translation..."
    }
  ],
  "related": ["id-1", "id-2"]      // Related kotowaza IDs
}
```

## Use Cases

- 🎓 **Japanese Learning Apps** — Quiz, flashcard, and study apps
- 🗓️ **"Quote of the Day"** — Use `random()` for daily proverb features
- 🤖 **Chatbots** — Enrich Japanese language bots with cultural wisdom
- 📱 **Mobile Apps** — Offline-ready, zero-dependency JSON dataset
- 🔬 **NLP Research** — Bilingual proverb corpus for language analysis
- 🎮 **Games** — Cultural trivia or educational game content

## Available Tags

The dataset uses the following thematic categories:

| Tag | Description |
| :--- | :--- |
| `animals` | 🐾 Animals & Nature |
| `life` | ⚔️ Life & General Wisdom |
| `strategy` | 🎯 Strategy & Tactics |
| `money` | 💰 Money & Business |
| `business` | 💼 Business |
| `relationships` | ❤️ Relationships |
| `motivation` | 🌟 Motivation |
| `patience` | ⏳ Patience & Perseverance |
| `warnings` | ⚠️ Warnings & Caution |
| `social` | 👥 Social Dynamics |
| `culture` | 🎌 Japanese Culture |
| `philosophy` | 🧠 Philosophy |
| `karma` | ☯️ Karma & Consequences |
| `numbers` | 🔢 Numbers |
| `efficiency` | ⚡ Efficiency |
| `food` | 🍡 Food & Cuisine |

## Contributing

Want to add more kotowaza? PRs are welcome! Each entry should follow the schema above.

You can browse the full collection of 600+ proverbs on [Jepang.org Peribahasa](https://jepang.org/peribahasa/) for reference.

## About

This dataset is compiled and maintained by **[Septian Ganendra S. K.](https://jepang.org/tentang-kami/)**, the Lead Maintainer at **[Jepang.org](https://jepang.org)** — Indonesia's comprehensive Japanese learning platform.

> 📚 **If you use this package in your project, we'd appreciate a link back to [Jepang.org](https://jepang.org)!**
> It helps us continue maintaining and expanding this free resource for Japanese learners worldwide.

### Related Packages

- **[kanji-png](https://www.npmjs.com/package/kanji-png)** — Generate Kanji PNGs and animated stroke-order GIFs. Also by [Jepang.org](https://jepang.org/kanji/).

## License

[MIT](LICENSE) © [Septian Ganendra S. K.](https://jepang.org)
