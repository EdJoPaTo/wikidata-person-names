#!/usr/bin/env sh
set -eux

./node_modules/.bin/tsc \
	--declaration \
	--ignoreConfig \
	--module es2015 \
	--target es2015 \
	index.ts

./node_modules/.bin/oxfmt index.js
