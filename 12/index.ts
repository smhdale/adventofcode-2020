import { inputAsStringArray, toCartesian, logTest, logAnswer } from '../helpers'

// Setup
const TEST_INSTRUCTIONS = inputAsStringArray(__dirname, 'test.txt')
const REAL_INSTRUCTIONS = inputAsStringArray(__dirname, 'input.txt')

function parseInstruction(raw: string): [string, number] {
	const [, action, value] = raw.match(/([A-Z])(\d+)/)
	return [action, Number(value)]
}

function getManhattanDistance(x: number, y: number): number {
	return Math.abs(x) + Math.abs(y)
}

// Part A
function navigateShip(instructions: string[]): number {
	// Track ship
	let x = 0
	let y = 0
	let bearing = Math.PI / 2

	const move = (distance: number) => {
		const delta = toCartesian(distance, bearing)
		x += Math.round(delta.x)
		y += Math.round(delta.y)
	}

	for (const instruction of instructions) {
		const [action, value] = parseInstruction(instruction)
		switch (action) {
			case 'N':
				y -= value
				break
			case 'S':
				y += value
				break
			case 'E':
				x -= value
				break
			case 'W':
				x += value
				break
			case 'L':
				bearing -= (value * Math.PI) / 180
				break
			case 'R':
				bearing += (value * Math.PI) / 180
				break
			case 'F':
				move(value)
				break
		}
	}

	return getManhattanDistance(x, y)
}

logTest('A', navigateShip(TEST_INSTRUCTIONS))
logAnswer('A', navigateShip(REAL_INSTRUCTIONS))
