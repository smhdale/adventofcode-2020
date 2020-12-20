import {
	inputAsStringArray,
	multiEnumerate,
	logAnswer,
	logTest,
	sumEach,
	FixedArray,
} from '../helpers'

// Setup
interface Cube<Dimensions extends number> {
	coord: FixedArray<number, Dimensions>
	equals(cube: Cube<Dimensions>): boolean
	neighbours(): Cube<Dimensions>[]
}

function createCube<L extends number>(coord: FixedArray<number, L>): Cube<L> {
	const equals = (cube: Cube<L>): boolean => {
		return coord.every((v, i) => v === cube.coord[i])
	}
	const neighbours = (): Cube<L>[] => {
		return multiEnumerate<L>(
			coord.map(() => [-1, 1]) as FixedArray<[number, number], L>
		)
			.filter((c) => c.some(Boolean))
			.map((c) => {
				const target = c.map((v, i) => v + coord[i]) as FixedArray<number, L>
				return createCube<L>(target)
			})
	}
	return { coord, equals, neighbours }
}

function nextBoard<L extends number>(board: Cube<L>[]): Cube<L>[] {
	const next: Cube<L>[] = []
	const checked: Cube<L>[] = []

	// Returns true if a cube exists in the checked cubes array
	const unchecked = (cube: Cube<L>): boolean => !checked.some(cube.equals)

	// Returns true if a cube on input board is active
	const active = (cube: Cube<L>): boolean => board.some((c) => c.equals(cube))

	// Returns true if a cube will survive this generation
	const willSurvive = (cube: Cube<L>): boolean => {
		const activeNeighbours = sumEach(cube.neighbours(), active)
		return active(cube)
			? activeNeighbours >= 2 && activeNeighbours <= 3
			: activeNeighbours === 3
	}

	for (const cube of board) {
		const candidates = [cube, ...cube.neighbours()].filter(unchecked)
		checked.push(...candidates)
		next.push(...candidates.filter(willSurvive))
	}

	return next
}

function parseInput<Dimensions extends number>(
	file: string,
	dimensions: Dimensions
): Cube<Dimensions>[] {
	const state = inputAsStringArray(__dirname, file)
	const width = state[0].length
	const height = state.length
	const board: Cube<Dimensions>[] = []

	const addCube = (x: number, y: number) => {
		const coord = Array(dimensions).fill(0) as FixedArray<number, Dimensions>
		coord[0] = x
		coord[1] = y
		board.push(createCube<Dimensions>(coord))
	}

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			if (state[y][x] === '#') addCube(x, y)
		}
	}

	return board
}

function simulate(file: string, dimensions: number, steps = 6) {
	let board = parseInput(file, dimensions)
	for (let step = 0; step < steps; step++) {
		board = nextBoard(board)
	}
	return board.length
}

// Part A
logTest('A', simulate('test.txt', 3))
logAnswer('A', simulate('input.txt', 3))

// Part B
logTest('B', simulate('test.txt', 4))
logAnswer('B', simulate('input.txt', 4))
