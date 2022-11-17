import {writeFileSync} from 'node:fs';

import {sparqlQuerySimplifiedMinified} from 'wikidata-sdk-got';

function buildQuery(category: string): string {
	return `SELECT DISTINCT ?label WHERE {
  ?item wdt:P31 wd:${category}.
  ?item rdfs:label ?label.
  FILTER(LANG(?label) = "en")
}
LIMIT 5000`;
}

async function instancesOfLabels(category: string): Promise<string[]> {
	console.time(`instancesOfLabels ${category}`);
	const query = buildQuery(category);
	const results = await sparqlQuerySimplifiedMinified(query) as string[];
	const sorted = results
		.sort((a, b) => a.localeCompare(b));

	console.timeEnd(`instancesOfLabels ${category}`);
	return sorted;
}

const SOURCE_ENTITY_ID: Readonly<Record<string, string>> = {
	UNISEX: 'Q3409032',
	MALE: 'Q12308941',
	FEMALE: 'Q11879590',
	FAMILY: 'Q101352',
};

async function run(): Promise<void> {
	let text = '';

	text += 'module.exports = {';
	text += '\n';

	const entries = await Promise.all(Object.entries(SOURCE_ENTITY_ID)
		.map(async ([key, entityId]) => {
			const values = await instancesOfLabels(entityId);
			const strings = values.map(o => `'${o.replace(/'/, '\\\'')}'`);

			let line = '';
			line += '\t';
			line += key;
			line += ': [\n';
			line += '\t\t';
			line += strings.join(', ');
			line += ',\n\t],';
			return line;
		}),
	);

	text += entries.join('\n');
	text += '\n';
	text += '};';
	text += '\n';

	writeFileSync('index.js', text, 'utf8');

	text = '';

	for (const key of Object.keys(SOURCE_ENTITY_ID)) {
		text += 'export declare const ';
		text += key;
		text += ': readonly string[];\n';
	}

	writeFileSync('index.d.ts', text, 'utf8');
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void run();
