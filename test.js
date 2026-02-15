'use strict';

/**
 * kotowaza test suite
 * Run: node test.js
 */
const k = require('.');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.error(`  ❌ ${message}`);
        failed++;
    }
}

console.log('\n🧪 kotowaza Test Suite\n');

// --- all() ---
console.log('📦 all()');
const all = k.all();
assert(Array.isArray(all), 'returns an array');
assert(all.length > 0, `has ${all.length} entries`);

// --- get() ---
console.log('\n🔍 get()');
const entry = k.get('nanakorobi-yaoki');
assert(entry !== null, 'finds nanakorobi-yaoki');
assert(entry.japanese === '七転び八起き', 'correct Japanese text');
assert(entry.meaning.id.length > 0, 'has Indonesian meaning');
assert(entry.meaning.en.length > 0, 'has English meaning');
assert(k.get('nonexistent') === null, 'returns null for unknown ID');

// --- search() ---
console.log('\n🔎 search()');
const searchJa = k.search('猿');
assert(searchJa.length > 0, 'finds entries by Japanese text');
const searchEn = k.search('monkey');
assert(searchEn.length > 0, 'finds entries by English meaning');
const searchRomaji = k.search('Nanakorobi');
assert(searchRomaji.length > 0, 'finds entries by romaji');
assert(k.search('').length === 0, 'empty query returns empty array');
assert(k.search(null).length === 0, 'null query returns empty array');

// --- byTag() ---
console.log('\n🏷️  byTag()');
const motivation = k.byTag('motivation');
assert(motivation.length > 0, 'finds entries by tag "motivation"');
assert(k.byTag('nonexistent').length === 0, 'returns empty for unknown tag');
assert(k.byTag('').length === 0, 'empty tag returns empty array');

// --- byTagId() ---
console.log('\n🏷️  byTagId()');
const motivasi = k.byTagId('motivasi');
assert(motivasi.length > 0, 'finds entries by Indonesian tag "motivasi"');
assert(k.byTagId('nonexistent').length === 0, 'returns empty for unknown Indonesian tag');

// --- byJlpt() ---
console.log('\n📊 byJlpt()');
const n3 = k.byJlpt('N3');
assert(n3.length > 0, 'finds entries for JLPT N3');
const n3Lower = k.byJlpt('n3');
assert(n3Lower.length > 0, 'case-insensitive JLPT level');
assert(k.byJlpt('N5').length === 0, 'returns empty for level with no entries');

// --- random() ---
console.log('\n🎲 random()');
const rand = k.random();
assert(rand !== undefined, 'returns an entry');
assert(typeof rand.id === 'string', 'random entry has an id');

// --- count() ---
console.log('\n📈 count()');
assert(k.count() === all.length, `count() matches all().length (${k.count()})`);
assert(k.count() > 0, 'count is positive');

// --- tags() ---
console.log('\n🏷️  tags()');
const allTags = k.tags();
assert(Array.isArray(allTags), 'returns an array');
assert(allTags.length > 0, `has ${allTags.length} unique tags`);
assert(allTags[0] <= allTags[1], 'tags are sorted alphabetically');

// --- jlptLevels() ---
console.log('\n📊 jlptLevels()');
const levels = k.jlptLevels();
assert(Array.isArray(levels), 'returns an array');
assert(levels.length > 0, `has ${levels.length} JLPT levels`);

// --- tagsId() ---
console.log('\n🏷️  tagsId()');
const allTagsId = k.tagsId();
assert(Array.isArray(allTagsId), 'returns an array');
assert(allTagsId.length > 0, `has ${allTagsId.length} unique Indonesian tags`);

// --- url() ---
console.log('\n🔗 url()');
const testUrl = k.url('nanakorobi-yaoki');
assert(testUrl === 'https://jepang.org/peribahasa/nanakorobi-yaoki/', 'generates correct URL');

// --- Data integrity ---
console.log('\n🔒 Data Integrity');
all.forEach(entry => {
    assert(typeof entry.id === 'string' && entry.id.length > 0, `${entry.id}: has valid id`);
    assert(typeof entry.japanese === 'string' && entry.japanese.length > 0, `${entry.id}: has japanese`);
    assert(typeof entry.reading === 'string' && entry.reading.length > 0, `${entry.id}: has reading`);
    assert(typeof entry.romaji === 'string' && entry.romaji.length > 0, `${entry.id}: has romaji`);
    assert(typeof entry.meaning === 'object', `${entry.id}: has meaning object`);
    assert(typeof entry.meaning.id === 'string', `${entry.id}: has Indonesian meaning`);
    assert(typeof entry.meaning.en === 'string', `${entry.id}: has English meaning`);
    assert(Array.isArray(entry.tags), `${entry.id}: has tags array`);
    assert(Array.isArray(entry.tags_id), `${entry.id}: has tags_id array`);
    assert(Array.isArray(entry.examples), `${entry.id}: has examples array`);
    assert(Array.isArray(entry.related), `${entry.id}: has related array`);
});

// --- Docs Parity Checks ---
console.log('\n📖 Docs Parity Checks (Examples from docs/index.html)');

// 1. Quick Start: Get by ID
const quickStartEntry = k.get('nanakorobi-yaoki');
if (quickStartEntry) {
    assert(quickStartEntry.japanese === '七転び八起き', 'Quick Start: "nanakorobi-yaoki" matches Japanese');
    assert(quickStartEntry.meaning.en.includes('No matter how many times'), 'Quick Start: meaning includes "No matter how many times"');
} else {
    assert(false, 'Quick Start: "nanakorobi-yaoki" not found');
}

// 2. Quick Start: Search
const qsSearchKp = k.search('猿');
assert(qsSearchKp.length > 0, 'Quick Start: search("猿") returns results');
const qsSearchEn = k.search('monkey');
assert(qsSearchEn.length > 0, 'Quick Start: search("monkey") returns results');

// 3. Quick Start: Filter by tag
const qsTag = k.byTag('motivation');
assert(qsTag.length > 0, 'Quick Start: byTag("motivation") returns results');

// 4. Quick Start: Filter by JLPT
const qsJlpt = k.byJlpt('N3');
assert(qsJlpt.length > 0, 'Quick Start: byJlpt("N3") returns results');

// 5. Quick Start: Random
const qsRandom = k.random();
assert(qsRandom && qsRandom.id, 'Quick Start: random() works');

// 6. Quick Start: URL
const qsUrl = k.url('nanakorobi-yaoki');
assert(qsUrl === 'https://jepang.org/peribahasa/nanakorobi-yaoki/', 'Quick Start: url() is correct');

// --- Summary ---
console.log(`\n${'─'.repeat(40)}`);
console.log(`📋 Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
    console.log('🎉 All tests passed!\n');
    process.exit(0);
} else {
    console.error(`💥 ${failed} test(s) failed!\n`);
    process.exit(1);
}
