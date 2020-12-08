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
		.trim()
		.split(/\r?\n/)
}

export function inputAsNumberArray(...paths: string[]): number[] {
	return inputAsStringArray(...paths).map(Number)
}

// Logging

export function logTest(part: 'A' | 'B', ...logs: any[]) {
	console.log(chalk.grey(`Part ${part} test case answer:`))
	console.log(...logs)
	console.log()
}

export function logAnswer(part: 'A' | 'B', ...logs: any[]) {
	console.log(chalk.green(`Part ${part} answer:`))
	console.log(...logs)
	console.log()
}
