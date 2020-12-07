#!/usr/bin/env ts-node-script

import fs = require('fs')
import path = require('path')

const day = (process.argv[2] || '').padStart(2, '0')
const dir = path.resolve(__dirname, '..', day)
const exe = path.resolve(dir, 'index.ts')

if (!fs.existsSync(dir) || !fs.existsSync(exe)) {
	console.log(`\nCouldn't find code for DAY ${day}, aborting.\n`)
	process.exit(0)
}

// Load and execute the day's code
const main = async () => {
	console.log(`\nRunning code for DAY ${day}...\n`)
	await import(exe)
}
main()
