#!/usr/bin/env bash
set -eux

function compile() {
	deno run -A npm:typescript@^4/tsc --declaration "$@"
}

compile --module commonjs --target es3 index.ts
mv index.js index.cjs

compile --module es2015 --target es2015 index.ts
mv index.js index.mjs

deno fmt
