import {
	inputAsStringArray,
	clamp,
	sumEach,
	logTest,
	logAnswer,
} from '../helpers'

// Setup
enum SeatType {
	Floor,
	Empty,
	Occupied,
}

type Seat = {
	type: SeatType
	row: number
	col: number
}

class Ferry {
	rows: number
	cols: number
	initialSeats: SeatType[][]
	seats: SeatType[][]

	constructor(rows: string[]) {
		this.rows = rows.length
		this.cols = rows[0].length
		this.initialSeats = rows.map((row) => {
			return [...row].map(Ferry.parseSeat)
		})
		this.reset()
	}

	private reset() {
		this.seats = Ferry.cloneSeats(this.initialSeats)
	}

	private eachSeat(callback: (seat: Seat) => void) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const type = this.getSeat(row, col)
				callback({ type, row, col })
			}
		}
	}

	// Returns true if seat layout changed
	private update(updater: (seat: Seat, ferry: this) => SeatType): boolean {
		let didUpdate = false
		const newSeats = Ferry.cloneSeats(this.seats)

		this.eachSeat((seat) => {
			const { type, row, col } = seat
			newSeats[row][col] = updater(seat, this)
			didUpdate ||= newSeats[row][col] !== type
		})

		this.seats = newSeats
		return didUpdate
	}

	getSeat(row: number, col: number): SeatType | undefined {
		return this.seats[row]?.[col]
	}

	simulate(updater: (seat: Seat, ferry: this) => SeatType) {
		this.reset()
		let changed: boolean
		do {
			changed = this.update(updater)
		} while (changed)
	}

	countOccupied(): number {
		let occupied = 0
		this.eachSeat((seat) => {
			occupied += Number(seat.type === SeatType.Occupied)
		})
		return occupied
	}

	private static cloneSeats(seats: SeatType[][]): SeatType[][] {
		return seats.map((row) => [...row])
	}

	static parseSeat(char: string): SeatType {
		switch (char) {
			case '#':
				return SeatType.Occupied
			case 'L':
				return SeatType.Empty
			default:
				return SeatType.Floor
		}
	}

	static stringify(seats: SeatType[][]): string {
		return seats
			.map((row) => {
				return row
					.map((seat) => {
						switch (seat) {
							case SeatType.Occupied:
								return '#'
							case SeatType.Empty:
								return 'L'
							default:
								return '.'
						}
					})
					.join('')
			})
			.join(`\n`)
	}
}

const testFerry = new Ferry(inputAsStringArray(__dirname, 'test.txt'))
const realFerry = new Ferry(inputAsStringArray(__dirname, 'input.txt'))

// Part A
function getAdjacents(seat: Seat, ferry: Ferry): SeatType[] {
	const neighbours = []
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i || j) {
				const type = ferry.getSeat(seat.row + i, seat.col + j)
				if (type !== undefined) neighbours.push(type)
			}
		}
	}
	return neighbours
}

function updaterA(seat: Seat, ferry: Ferry): SeatType {
	const neighbours = getAdjacents(seat, ferry)
	const occupied = sumEach(neighbours, (n) => n === SeatType.Occupied)

	return seat.type === SeatType.Empty && occupied === 0
		? SeatType.Occupied
		: seat.type === SeatType.Occupied && occupied >= 4
		? SeatType.Empty
		: seat.type
}

testFerry.simulate(updaterA)
logTest('A', testFerry.countOccupied())

realFerry.simulate(updaterA)
logAnswer('A', realFerry.countOccupied())

// Part B
function getSightNeighbours(seat: Seat, ferry: Ferry) {
	const neighbours = []

	const inBounds = (row: number, col: number): boolean => {
		return (
			clamp(row, 0, ferry.rows - 1) === row &&
			clamp(col, 0, ferry.cols - 1) === col
		)
	}

	const look = (seat: Seat, dr: number, dc: number): SeatType | undefined => {
		let row = seat.row
		let col = seat.col
		do {
			row += dr
			col += dc
			const type = ferry.getSeat(row, col)
			if (type !== SeatType.Floor) return type
		} while (inBounds(row, col))
		return undefined
	}

	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			if (dr || dc) {
				const type = look(seat, dr, dc)
				if (type !== undefined) neighbours.push(type)
			}
		}
	}
	return neighbours
}

function updaterB(seat: Seat, ferry: Ferry): SeatType {
	const neighbours = getSightNeighbours(seat, ferry)
	const occupied = sumEach(neighbours, (n) => n === SeatType.Occupied)

	return seat.type === SeatType.Empty && occupied === 0
		? SeatType.Occupied
		: seat.type === SeatType.Occupied && occupied >= 5
		? SeatType.Empty
		: seat.type
}

testFerry.simulate(updaterB)
logTest('B', testFerry.countOccupied())

realFerry.simulate(updaterB)
logAnswer('B', realFerry.countOccupied())
