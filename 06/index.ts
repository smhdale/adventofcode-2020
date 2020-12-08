import { inputAsGroupedStringArray, sumEach, logAnswer } from '../helpers'
const groups = inputAsGroupedStringArray(__dirname, 'input.txt')

// Part A
function countUniqueAnswers(group: string[]) {
	return new Set([...group.join('')]).size
}
const totalUniqueAnswers = sumEach(groups, countUniqueAnswers)
logAnswer('A', totalUniqueAnswers)

// Part B
function countUnanimousAnswers(group: string[]) {
	const uniqueAnswers = Array.from(new Set([...group.join('')]))
	return sumEach(uniqueAnswers, (answer) => {
		return group.every((person) => person.includes(answer))
	})
}
const totalUnanimousAnswers = sumEach(groups, countUnanimousAnswers)
logAnswer('B', totalUnanimousAnswers)
