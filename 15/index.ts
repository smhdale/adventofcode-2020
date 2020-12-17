import { cursorTo } from 'readline'
import { logTest, logAnswer } from '../helpers'

const TEST_INPUT = [0, 3, 6]
const REAL_INPUT = [0, 13, 16, 17, 1, 10, 6]

// Setup
interface FIFO<T> {
	add(item: T): void
	get(): T[]
}
type GameNumber = {
	value: number
	history: FIFO<number>
	timesSpoken: number
}

function fifo<T>(max = 2): FIFO<T> {
	let state: T[] = []

	const add = (item: T) => {
		state = [item, ...state].slice(0, max)
	}
	const get = (): T[] => {
		return state
	}

	return { add, get }
}

function game() {
	const state: Map<number, GameNumber> = new Map()
	let lastSpoken = 0

	const get = (n: number) => {
		if (!state.has(n)) {
			state.set(n, { value: n, history: fifo(), timesSpoken: 0 })
		}
		return state.get(n)
	}
	const speak = (n: number, round: number) => {
		const entry = get(n)
		entry.history.add(round)
		entry.timesSpoken++
		state.set(n, entry)
		lastSpoken = n
	}
	const getLast = () => {
		return get(lastSpoken)
	}

	return { getLast, speak }
}

function playGame(input: number[], until: number): number {
	const state = game()
	let round = 0

	const playRound = () => {
		if (round < input.length) {
			state.speak(input[round], round)
		} else {
			const prev = state.getLast()
			const [prev1, prev2] = prev.history.get()
			const number = prev.timesSpoken === 1 ? 0 : prev1 - prev2
			state.speak(number, round)
		}
	}

	while (round < until) {
		playRound()
		round++
	}

	return state.getLast().value
}

// Part A
logTest('A', playGame(TEST_INPUT, 2020))
logAnswer('A', playGame(REAL_INPUT, 2020))

// Part B
logAnswer('A', playGame(REAL_INPUT, 30000000))
