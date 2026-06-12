import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const indexHtml = readFileSync("index.html", "utf8");
const headerJs = readFileSync("components/header.js", "utf8");
const indexJs = readFileSync("index.js", "utf8");
const projectListJs = readFileSync("components/project-list.js", "utf8");
const projectsJs = readFileSync("data/projects.js", "utf8");
const stylesCss = readFileSync("styles/styles.css", "utf8");

function positionOf(fragment) {
	const index = indexHtml.indexOf(fragment);
	assert.notEqual(index, -1, `Missing homepage fragment: ${fragment}`);
	return index;
}

const hero = positionOf('class="home-hero"');
const writing = positionOf('id="writing"');
const work = positionOf('id="work"');
const experience = positionOf('id="experience"');

assert(
	hero < writing && writing < work && work < experience,
	"Homepage sections must follow hero -> writing -> work -> experience",
);

assert.match(indexHtml, /<latest-posts><\/latest-posts>/);
assert.match(indexHtml, /<project-list\s+featured><\/project-list>/);
assert.doesNotMatch(indexHtml, /class="hero-kicker"/);
assert.doesNotMatch(indexHtml, /class="section-label"/);
assert.doesNotMatch(indexHtml, /id="career"/);
assert.doesNotMatch(indexHtml, />Projects\s*<a/);

assert.match(headerJs, /class="brand-link"/);
assert.match(headerJs, />Writing<\/a>/);
assert.match(headerJs, />Work<\/a>/);
assert.match(headerJs, />About<\/a>/);
assert.doesNotMatch(headerJs, />Home<\/a>/);

assert.match(indexJs, /registerLatestPosts\(\)/);
assert.match(projectListJs, /hasAttribute\("featured"\)/);
assert.doesNotMatch(
	stylesCss,
	/\.home-page\s+(?:app-header|section|app-footer)[\s\S]*?max-width\s*:/,
	"Homepage must not override the shared page container width",
);

const featuredCount = (projectsJs.match(/featured:\s*true/g) || []).length;
assert(
	featuredCount >= 3,
	`Expected at least 3 featured projects, found ${featuredCount}`,
);

console.log("Homepage structure verified.");
