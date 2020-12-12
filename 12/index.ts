import { inputAsStringArray, toCartesian, logTest, logAnswer } from '../helpers'

// Setup
class Ship {
	x: number
	y: number
	bearing: number

	constructor() {
		this.reset()
	}

	get manhattanDistance(): number {
		return Math.abs(this.x) + Math.abs(this.y)
	}

	private reset() {
		this.x = 0
		this.y = 0
		this.bearing = Math.PI / 2
	}

	private turn(degrees: number) {
		this.bearing += (degrees * Math.PI) / 180
	}

	private move(distance: number) {
		// Move in direction of current bearing
		const { x, y } = toCartesian(distance, this.bearing)
		this.x += Math.round(x)
		this.y += Math.round(y)
	}

	private followInstruction(instruction: string) {
		// Parse instruction
		const [, dir, rawValue] = instruction.match(/([A-Z])(\d+)/)
		const value = Number(rawValue)

		switch (dir) {
			case 'N':
				this.y -= value
				break
			case 'S':
				this.y += value
				break
			case 'E':
				this.x -= value
				break
			case 'W':
				this.x += value
				break
			case 'L':
				this.turn(-value)
				break
			case 'R':
				this.turn(value)
				break
			case 'F':
				this.move(value)
				break
			default:
				console.log('Unrecognised instruction:', instruction)
		}
	}

	navigate(instructions: string[]) {
		this.reset()
		instructions.forEach(this.followInstruction.bind(this))
	}
}

const TEST_INSTRUCTIONS = inputAsStringArray(__dirname, 'test.txt')
const REAL_INSTRUCTIONS = inputAsStringArray(__dirname, 'input.txt')

const ferry = new Ship()

// Part A
ferry.navigate(TEST_INSTRUCTIONS)
logTest('A', ferry.manhattanDistance)

ferry.navigate(REAL_INSTRUCTIONS)
logAnswer('A', ferry.manhattanDistance)
