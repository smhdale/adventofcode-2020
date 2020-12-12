import { inputAsStringArray, sumEach, logTest, logAnswer } from '../helpers'

// Setup
type SeatState = 'floor' | 'empty' | 'occupied'

class Seat {
	state: SeatState

	constructor(initialState: SeatState) {
		this.state = initialState
	}

	update(neighbours: Seat[]): boolean {
		const occupied = sumEach(neighbours, (seat) => seat.state === 'occupied')

		if (this.state === 'empty' && occupied === 0) {
			this.state = 'occupied'
			return true
		} else if (this.state === 'occupied' && occupied >= 4) {
			this.state = 'empty'
			return true
		}
		return false
	}

	static fromChar(char: string): Seat {
		switch (char) {
			case '#':
				return new Seat('occupied')
			case 'L':
				return new Seat('empty')
			default:
				return new Seat('floor')
		}
	}
}

class Ferry {
	rows: number
	cols: number
	seats: Seat[][]
	tick = 0

	constructor(rows: string[]) {
		this.rows = rows.length
		this.cols = rows[0].length
		this.seats = rows.map((row) => {
			return [...row].map(Seat.fromChar)
		})
	}

	private getSeat(row: number, col: number): Seat | undefined {
		return this.seats[row]?.[col]
	}

	private getNeighbours(row: number, col: number): Seat[] {
		const neighbours = []
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i && j) {
					const seat = this.getSeat(row + i, col + j)
					if (seat) neighbours.push(seat)
				}
			}
		}
		return neighbours
	}

	private eachSeat(callback: (seat: Seat, row: number, col: number) => void) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				callback(this.getSeat(row, col), row, col)
			}
		}
	}

	private update(): boolean {
		let didUpdate = false
		this.eachSeat((seat, row, col) => {
			const neighbours = this.getNeighbours(row, col)
			didUpdate ||= seat.update(neighbours)
		})
		return didUpdate
	}

	simulate(): number {
		while (this.update()) this.tick++
		return this.tick
	}

	countOccupied(): number {
		let occupied = 0
		this.eachSeat((seat) => {
			occupied += Number(seat.state === 'occupied')
		})
		return occupied
	}
}

const testFerry = new Ferry(inputAsStringArray(__dirname, 'test.txt'))
const realFerry = new Ferry(inputAsStringArray(__dirname, 'input.txt'))

// Part A
testFerry.simulate()
logTest('A', testFerry.countOccupied())
