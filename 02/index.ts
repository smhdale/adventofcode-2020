import { inputAsStringArray, answer } from '../helpers'

// Setup
const regex = /(\d+)-(\d+) ([a-z]): ([a-z]+)/
const entries = inputAsStringArray(__dirname, 'input.txt').map((line) => {
	const [, min, max, char, password] = line.match(regex)
	return {
		min: Number(min),
		max: Number(max),
		char,
		password,
	}
})

// Part A
const validA = entries.reduce((acc, { password, char, min, max }) => {
	const count = Array.from(password).reduce((acc, compare) => {
		return acc + Number(char === compare)
	}, 0)
	return acc + Number(count >= min && count <= max)
}, 0)
answer('A', validA)

// Part B
const validB = entries.reduce((acc, { password, char, min, max }) => {
	const a = Number(password[min - 1] === char)
	const b = Number(password[max - 1] === char)
	return acc + (a ^ b)
}, 0)
answer('B', validB)
