import { readFileSync } from 'fs'
import { inputAsNumberArray, answer } from '../helpers'

// Setup
const nums = inputAsNumberArray(__dirname, 'input.txt')
const count = nums.length
const target = 2020

// Part A
for (let a = 0; a < count - 1; a++) {
	for (let b = a + 1; b < count; b++) {
		if (nums[a] + nums[b] === target) {
			answer('A', nums[a] * nums[b])
		}
	}
}

// Part B
for (let a = 0; a < count - 2; a++) {
	for (let b = a + 1; b < count - 1; b++) {
		for (let c = b + 1; c < count; c++) {
			if (nums[a] + nums[b] + nums[c] === target) {
				answer('B', nums[a] * nums[b] * nums[c])
			}
		}
	}
}
