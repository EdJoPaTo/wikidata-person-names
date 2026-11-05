import { writeFileSync } from "node:fs";

import {
	minimizeSimplifiedSparqlResults,
	simplifySparqlResults,
	type SparqlResults,
} from "wikibase-sdk";
import { wdk } from "wikibase-sdk/wikidata.org";

function buildQuery(category: string): string {
	return `SELECT DISTINCT ?label WHERE {
  ?item wdt:P31 wd:${category}.
  ?item rdfs:label ?label.
  FILTER(LANG(?label) = "en")
}
LIMIT 5000`;
}

async function sparqlQuerySimplifiedMinified(query: string) {
	const headers = new Headers();
	headers.append("user-agent", "wikidata-person-names update-names.ts");

	const url = wdk.sparqlQuery(query);
	const response = await fetch(url, { headers });
	if (response.status !== 200) {
		throw new Error(`Wikidata SparQL failed: ${response.status} ${response.statusText}`);
	}

	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const body = (await response.json()) as SparqlResults;
	const simplified = simplifySparqlResults(body);
	const minimized = minimizeSimplifiedSparqlResults(simplified);
	return minimized;
}

async function instancesOfLabels(category: string): Promise<string[]> {
	console.time(`instancesOfLabels ${category}`);
	const query = buildQuery(category);
	const results = (await sparqlQuerySimplifiedMinified(query))
		.filter((o) => typeof o === "string")
		.sort((a, b) => a.localeCompare(b));
	console.timeEnd(`instancesOfLabels ${category}`);
	return results;
}

const SOURCE_ENTITY_ID = {
	UNISEX: "Q3409032",
	MALE: "Q12308941",
	FEMALE: "Q11879590",
	FAMILY: "Q101352",
} as const;

const entries: string[] = [];
for (const [key, entityId] of Object.entries(SOURCE_ENTITY_ID)) {
	// oxlint-disable-next-line no-await-in-loop
	const values = await instancesOfLabels(entityId);
	const strings = values.map((o) => JSON.stringify(o));

	let line = "";
	line += `/** Generated from \`${entityId}\` */\n`;
	line += "export const ";
	line += key;
	line += ": readonly string[] = [\n";
	line += strings.map((o) => `\t${o},\n`).join("");
	line += "];";
	entries.push(line);
}

const content = entries.join("\n") + "\n";
writeFileSync("index.ts", content);
