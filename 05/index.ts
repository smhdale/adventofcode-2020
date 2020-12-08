import { inputAsStringArray, logAnswer } from '../helpers'

// Setup
class Plane {
	rows: number
	columns: number
	seats: boolean[]

	constructor(rows: number, columns: number) {
		this.rows = rows
		this.columns = columns
		this.seats = Array(rows * columns).fill(false)
	}

	private find(dirs: boolean[], min: number, max: number) {
		if (!dirs.length || min === max) return min
		const [dir, ...rest] = dirs
		const half = (max - min + 1) / 2
		const newMin = dir ? min : min + half
		const newMax = dir ? max - half : max
		return this.find(rest, newMin, newMax)
	}

	private findRow(dirs: string[]) {
		return this.find(
			dirs.map((dir) => dir === 'F'),
			0,
			this.rows - 1
		)
	}

	private findCol(dirs: string[]) {
		return this.find(
			dirs.map((dir) => dir === 'L'),
			0,
			this.columns - 1
		)
	}

	private getSeatID(row: number, col: number): number {
		return row * this.columns + col
	}

	// Marks a seat on the plane as filled, returning its number
	fillSeat(boardingPass: string): number {
		const [, rowDirs, colDirs] = boardingPass
			.match(/([FB]+)([LR]+)/)
			.map((seq) => seq.split(''))
		const row = this.findRow(rowDirs)
		const col = this.findCol(colDirs)
		const id = this.getSeatID(row, col)
		this.seats[id] = true
		return id
	}

	// Finds an empty seat with full seats either side
	findGap(): number | null {
		const max = this.getSeatID(this.rows, this.columns)
		for (let i = 1; i < max - 2; i++) {
			const [a, b, c] = this.seats.slice(i - 1, i + 2)
			if (a && !b && c) return i
		}
		return null
	}
}

const plane = new Plane(128, 8)
const passes = inputAsStringArray(__dirname, 'input.txt')

// Part A
const seats = passes.map((pass) => plane.fillSeat(pass))
const highest = Math.max(...seats)
logAnswer('A', highest)

// Part B
logAnswer('B', plane.findGap())
