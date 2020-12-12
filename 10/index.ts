import { inputAsNumberArray, logAnswer, logTest, sumEach } from '../helpers'

// Setup
type AdapterMap = Record<number, number[]>

const JOLTAGE_SOURCE = 0
const TEST_ADAPTERS = [
	JOLTAGE_SOURCE,
	...inputAsNumberArray(__dirname, 'test.txt'),
]
const ADAPTERS = [JOLTAGE_SOURCE, ...inputAsNumberArray(__dirname, 'input.txt')]

function getDevice(adapters: number[]): number {
	return Math.max(...adapters) + 3
}

// Part A
function chainAdapters(adapters: number[]): Map<number, number> {
	const sorted = adapters.sort((a, b) => a - b)
	const count = sorted.length
	const device = getDevice(adapters)

	const differenceCounts: Map<number, number> = new Map()
	const incrDifference = (diff: number) => {
		const count = differenceCounts.get(diff) || 0
		differenceCounts.set(diff, count + 1)
	}

	sorted.forEach((adapter, index, arr) => {
		const next = index < count - 1 ? arr[index + 1] : device
		incrDifference(next - adapter)
	})

	return differenceCounts
}

const testDiffs = chainAdapters(TEST_ADAPTERS)
logTest('A', testDiffs.get(1) * testDiffs.get(3))

const realDiffs = chainAdapters(ADAPTERS)
logAnswer('A', realDiffs.get(1) * realDiffs.get(3))

// Part B
function getConnections(joltage: number, adapters: number[]): number[] {
	return adapters.filter((adapter) => {
		return adapter > joltage && adapter <= joltage + 3
	})
}

function buildMap(adapters: number[]): AdapterMap {
	return adapters.reduce((map, adapter, i, arr) => {
		map[adapter] = getConnections(adapter, arr)
		return map
	}, {})
}

function countAllPathways(adapters: number[]) {
	const device = getDevice(adapters)
	const sorted = adapters.sort((a, b) => b - a)

	const map = buildMap(adapters)
	const paths: Map<number, number> = new Map()

	sorted.forEach((adapter) => {
		const pathsFromHere = sumEach(map[adapter], (child) => {
			return child === device ? 1 : paths.get(child)
		})
		paths.set(adapter, pathsFromHere || 1)
	})

	return paths.get(0)
}

logTest('B', countAllPathways(TEST_ADAPTERS))
logAnswer('B', countAllPathways(ADAPTERS))
