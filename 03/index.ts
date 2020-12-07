import { inputAsStringArray, logTest, logAnswer } from '../helpers'

// Setup
enum Terrain {
	Empty = '.',
	Tree = '#',
}

type Slope = [number, number]

class TreeMap {
	width: number
	height: number
	map: number[]

	constructor(file: string) {
		const rows = inputAsStringArray(__dirname, file)
		this.width = rows[0].length
		this.height = rows.length
		this.map = TreeMap.parse(rows)
	}

	checkForTree(x: number, y: number): number {
		const row = this.map[y]
		return 1 & (row >> x % this.width)
	}

	static parse(input: string[]) {
		return input.map((row) => {
			const binary = Array.from(row)
				.reverse()
				.map((char) => (char === Terrain.Tree ? '1' : 0))
				.join('')
			return parseInt(binary, 2)
		})
	}
}

function traverse(map: TreeMap, [dx, dy]: Slope) {
	let x = 0
	let y = 0
	let trees = 0
	while (y < map.height) {
		x += dx
		y += dy
		if (y >= map.height) break
		trees += map.checkForTree(x, y)
	}
	return trees
}

function traverseMulti(map, slopes: Slope[]) {
	return slopes.reduce((acc, slope) => acc * traverse(map, slope), 1)
}

const mapTest = new TreeMap('test.txt')
const mapReal = new TreeMap('input.txt')

// Part A
logTest('A', traverse(mapTest, [3, 1]))
logAnswer('A', traverse(mapReal, [3, 1]))

// Part B
const slopes: Slope[] = [
	[1, 1],
	[3, 1],
	[5, 1],
	[7, 1],
	[1, 2],
]
logTest('B', traverseMulti(mapTest, slopes))
logAnswer('B', traverseMulti(mapReal, slopes))
