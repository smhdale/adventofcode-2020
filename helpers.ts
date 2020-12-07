import fs = require('fs')
import path = require('path')
import chalk = require('chalk')

// File I/O

export function input(...paths: string[]): string {
	const target = path.resolve(...paths)
	return String(fs.readFileSync(target))
}

export function inputAsStringArray(...paths: string[]): string[] {
	return input(...paths)
		.split(/\r?\n/)
		.filter(Boolean)
}

export function inputAsNumberArray(...paths: string[]): number[] {
	return inputAsStringArray(...paths).map(Number)
}

// Logging

export function answer(part: 'A' | 'B', ...logs: any[]) {
	console.log(chalk.green(`Part ${part} answer:`))
	console.log(...logs)
	console.log()
}
