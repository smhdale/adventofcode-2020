import { time } from 'console'
import { off } from 'process'
import { inputAsStringArray, logTest, logAnswer } from '../helpers'

// Setup
type Bus = {
	id: number
	offset: number
}
type DelayedBus = {
	id: number
	delay: number
}
function parseTimetable(file: string) {
	const [earliestDeparture, buses] = inputAsStringArray(__dirname, file)
	return {
		earliestDeparture: Number(earliestDeparture),
		buses: buses.split(',').reduce((acc, bus, index, arr) => {
			if (bus !== 'x') {
				const id = Number(bus)
				const offset = arr.length - index - 1
				acc.push({ id, offset })
			}
			return acc
		}, [] as Bus[]),
	}
}
const TEST_INPUT = parseTimetable('test.txt')
const REAL_INPUT = parseTimetable('input.txt')

// Part A
function getDelay(id: number, earliestDeparture: number): number {
	return (id - (earliestDeparture % id)) % id
}
function findEarliestBus(buses: Bus[], earliestDeparture: number): DelayedBus {
	const busesWithDelay = buses.map(({ id }) => {
		return { id, delay: getDelay(id, earliestDeparture) }
	})
	const minDelay = Math.min(...busesWithDelay.map((bus) => bus.delay))
	return busesWithDelay[
		busesWithDelay.findIndex((bus) => bus.delay === minDelay)
	]
}

const testA = findEarliestBus(TEST_INPUT.buses, TEST_INPUT.earliestDeparture)
logTest('A', testA.id * testA.delay)

const resultA = findEarliestBus(REAL_INPUT.buses, REAL_INPUT.earliestDeparture)
logAnswer('A', resultA.id * resultA.delay)

// Part B
function findDepartureSequence(buses: Bus[]): number {
	const numBuses = buses.length
	if (numBuses === 0) {
		return 0
	} else if (numBuses === 1) {
		return buses[0].offset
	} else {
		// Sort in descending order of bus loop time
		const [first, ...rest] = buses.sort((a, b) => b.id - a.id)

		let cursor = first.offset
		let increment = first.id
		while (rest.length > 0) {
			const bus = rest.shift()
			const target = bus.offset % bus.id
			while (cursor % bus.id !== target) {
				cursor += increment
			}
			increment *= bus.id
		}

		return cursor - Math.max(...buses.map((bus) => bus.offset))
	}
}

logTest('B', findDepartureSequence(TEST_INPUT.buses))
logAnswer('B', findDepartureSequence(REAL_INPUT.buses))
