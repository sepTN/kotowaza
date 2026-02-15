'use strict';

const data = require('./data/kotowaza.json');

/**
 * kotowaza — Japanese Proverbs Dataset
 * https://jepang.org/peribahasa/
 *
 * A structured dataset of Japanese proverbs (kotowaza) with meanings
 * in Indonesian & English, example sentences, JLPT levels, and tags.
 *
 * @author Septian Ganendra S. K. (https://jepang.org)
 * @license MIT
 */

/** @type {Map<string, object>} Internal lookup map for O(1) get() */
const _index = new Map(data.map(entry => [entry.id, entry]));

/**
 * Returns all kotowaza entries.
 * @returns {object[]} Array of all entries
 */
function all() {
    return data;
}

/**
 * Returns a single kotowaza by its ID (URL slug).
 * @param {string} id - The slug, e.g. 'nanakorobi-yaoki'
 * @returns {object|null} The entry, or null if not found
 */
function get(id) {
    return _index.get(id) || null;
}

/**
 * Searches across Japanese text, romaji, literal, and meanings.
 * Case-insensitive for romaji/English. Matches partial strings.
 * @param {string} query - Search term
 * @returns {object[]} Matching entries
 */
function search(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.toLowerCase();
    return data.filter(entry =>
        entry.japanese.includes(query) ||
        entry.reading.includes(query) ||
        entry.romaji.toLowerCase().includes(q) ||
        entry.literal.toLowerCase().includes(q) ||
        entry.meaning.id.toLowerCase().includes(q) ||
        entry.meaning.en.toLowerCase().includes(q)
    );
}

/**
 * Returns entries matching a specific tag (English).
 * @param {string} tag - Tag to filter by (e.g. 'motivation', 'animals')
 * @returns {object[]} Matching entries
 */
function byTag(tag) {
    if (!tag || typeof tag !== 'string') return [];
    const t = tag.toLowerCase();
    return data.filter(entry =>
        entry.tags.some(entryTag => entryTag.toLowerCase() === t)
    );
}

/**
 * Returns entries matching a specific Indonesian tag.
 * @param {string} tag - Indonesian tag to filter by (e.g. 'motivasi', 'hewan')
 * @returns {object[]} Matching entries
 */
function byTagId(tag) {
    if (!tag || typeof tag !== 'string') return [];
    const t = tag.toLowerCase();
    return data.filter(entry =>
        entry.tags_id && entry.tags_id.some(entryTag => entryTag.toLowerCase() === t)
    );
}

/**
 * Returns entries for a specific JLPT level.
 * @param {string} level - JLPT level (e.g. 'N3', 'N2')
 * @returns {object[]} Matching entries
 */
function byJlpt(level) {
    if (!level || typeof level !== 'string') return [];
    const l = level.toUpperCase();
    return data.filter(entry => entry.jlpt === l);
}

/**
 * Returns one random kotowaza entry.
 * @returns {object} A random entry
 */
function random() {
    return data[Math.floor(Math.random() * data.length)];
}

/**
 * Returns the total number of entries.
 * @returns {number} Count
 */
function count() {
    return data.length;
}

/**
 * Returns all unique tags (English) sorted alphabetically.
 * @returns {string[]} Array of unique tags
 */
function tags() {
    const tagSet = new Set();
    data.forEach(entry => entry.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
}

/**
 * Returns all unique Indonesian tags sorted alphabetically.
 * @returns {string[]} Array of unique Indonesian tags
 */
function tagsId() {
    const tagSet = new Set();
    data.forEach(entry => {
        if (entry.tags_id) entry.tags_id.forEach(t => tagSet.add(t));
    });
    return [...tagSet].sort();
}

/**
 * Returns all unique JLPT levels present in the dataset.
 * @returns {string[]} Array of JLPT levels, e.g. ['N2', 'N3', 'N4']
 */
function jlptLevels() {
    const levels = new Set();
    data.forEach(entry => {
        if (entry.jlpt) levels.add(entry.jlpt);
    });
    return [...levels].sort();
}

/**
 * Returns the URL for a kotowaza on jepang.org.
 * @param {string} id - The kotowaza ID/slug
 * @returns {string} Full URL
 */
function url(id) {
    return `https://jepang.org/peribahasa/${id}/`;
}

module.exports = {
    all,
    get,
    search,
    byTag,
    byTagId,
    byJlpt,
    random,
    count,
    tags,
    tagsId,
    jlptLevels,
    url
};
