#!/usr/bin/env bash
set -eux

alias tsc='deno run -A npm:typescript@^4/tsc'

deno run -A generate.ts

tsc --declaration --module commonjs --target es3 index.ts
mv index.js index.cjs

tsc --declaration --module es6 --target es6 index.ts
mv index.js index.mjs

deno fmt
npm pack
