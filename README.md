# wikidata-person-names

[![NPM Version](https://img.shields.io/npm/v/wikidata-person-names.svg)](https://www.npmjs.com/package/wikidata-person-names)
[![node](https://img.shields.io/node/v/wikidata-person-names.svg)](https://www.npmjs.com/package/wikidata-person-names)

> Set of given and last names pulled from Wikidata

When using random names I needed a list of names. Wikidata has a lot of them, so
I pulled them from there. As names don't change that often and are rather static
this repo is a snapshot from Wikidata.

Maintainer Hint: Updating the file (with `update-names.ts`) will query different
names than before as LIMIT in the SparQL query is non-deterministic.

## Usage

### Node.js

```bash
npm install wikidata-person-names
```

```js
import { FAMILY, UNISEX } from "wikidata-person-names";

UNISEX;
//=> ['Akira', 'Alba', 'Jody', 'Marie', 'Sacha', …]

FAMILY;
//=> ['Hein', 'Ling', 'Owen', …]

randomItem(UNISEX);
//=> 'Jule'
```

### Deno

via [ghc.deno.dev](https://github.com/dcdunkan/ghc.deno.dev)

```ts
import {
	FAMILY,
	UNISEX,
} from "https://ghc.deno.dev/EdJoPaTo/wikidata-person-names/index.ts";

UNISEX;
//=> ['Akira', 'Alba', 'Jody', 'Marie', 'Sacha', …]

FAMILY;
//=> ['Hein', 'Ling', 'Owen', …]

randomItem(UNISEX);
//=> 'Jule'
```
