import { simplify } from "npm:wikibase-sdk@^9";
import { wdk } from "npm:wikibase-sdk@^9/wikidata.org";

function buildQuery(category: string): string {
	return `SELECT DISTINCT ?label WHERE {
  ?item wdt:P31 wd:${category}.
  ?item rdfs:label ?label.
  FILTER(LANG(?label) = "en")
}
LIMIT 5000`;
}

async function sparqlQuerySimplifiedMinified(query: string) {
	const url = wdk.sparqlQuery(query);
	const response = await fetch(url);
	const body = await response.json();
	const simplified = simplify.sparqlResults(body, { minimize: true });
	return simplified;
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

const SOURCE_ENTITY_ID = {
	UNISEX: "Q3409032",
	MALE: "Q12308941",
	FEMALE: "Q11879590",
	FAMILY: "Q101352",
} as const;

const entries = await Promise.all(
	Object.entries(SOURCE_ENTITY_ID).map(async ([key, entityId]) => {
		const values = await instancesOfLabels(entityId);
		const strings = values.map((o) => JSON.stringify(o));

		let line = "";
		line += "export const ";
		line += key;
		line += ": readonly string[] = [\n";
		line += strings.map((o) => `\t${o},\n`).join("");
		line += "];";
		return line;
	}),
);

const content = entries.join("\n") + "\n";
await Deno.writeTextFile("index.ts", content);
