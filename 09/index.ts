import { inputAsNumberArray, everyPair, sumEach, logAnswer } from '../helpers'

// Setup
const SEQUENCE = inputAsNumberArray(__dirname, 'input.txt')
const SEQUENCE_LENGTH = SEQUENCE.length
const PREAMBLE_LENGTH = 30

// Part A
function findVulnerableNumber(): number {
	for (let i = PREAMBLE_LENGTH; i < SEQUENCE_LENGTH; i++) {
		const target = SEQUENCE[i]
		const candidates = SEQUENCE.slice(i - PREAMBLE_LENGTH, i)
		const combinations = everyPair(candidates)
		if (!combinations.some(([a, b]) => a + b === target)) {
			return target
		}
	}
	throw Error('No numbers are vulnerable')
}

const vulnerableNumber = findVulnerableNumber()
logAnswer('A', vulnerableNumber)

// Part B
function calculateWeakness(range: number[]): number {
	const min = Math.min(...range)
	const max = Math.max(...range)
	return min + max
}

function findWeaknessAt(index: number, target: number): number | null {
	let cursor = index
	while (cursor < SEQUENCE_LENGTH) {
		const range = SEQUENCE.slice(index, ++cursor)
		if (sumEach(range, (n) => n) === target) {
			return calculateWeakness(range)
		}
	}
	return null
}

function findWeakness(target: number): number | null {
	let cursor = 0
	while (cursor < SEQUENCE_LENGTH - 1) {
		const possibleWeakness = findWeaknessAt(cursor, target)
		if (possibleWeakness !== null) return possibleWeakness
		cursor++
	}
	return null
}

const weakness = findWeakness(vulnerableNumber)
logAnswer('B', weakness)
