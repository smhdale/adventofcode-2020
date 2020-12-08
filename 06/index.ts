import { inputAsGroupedStringArray, logAnswer } from '../helpers'
const groups = inputAsGroupedStringArray(__dirname, 'input.txt')

// Part A
function countUniqueAnswers(group: string[]) {
	return new Set([...group.join('')]).size
}
const totalUniqueAnswers = groups.reduce((total, group) => {
	return total + countUniqueAnswers(group)
}, 0)
logAnswer('A', totalUniqueAnswers)

// Part B
function countUnanimousAnswers(group: string[]) {
	return Array.from(new Set([...group.join('')])).reduce((total, answer) => {
		return total + Number(group.every((person) => person.includes(answer)))
	}, 0)
}
const totalUnanimousAnswers = groups.reduce((total, group) => {
	return total + countUnanimousAnswers(group)
}, 0)
logAnswer('B', totalUnanimousAnswers)
