import {
	inputAsGroupedStringArray,
	clone,
	logTest,
	logAnswer,
} from '../helpers'

// Setup
type Ticket = number[]
type LabelOptions = string[][]
interface Range {
	label: string
	contains: (n: number) => boolean
}

function parseRange(rawRange: string): Range {
	const [label, rawRanges] = rawRange.split(':')
	const ranges = rawRanges
		.match(/(\d+-\d+)/g)
		.map((rawRange) => rawRange.split('-').map(Number))

	const contains = (n: number): boolean => {
		return ranges.some(([min, max]) => n >= min && n <= max)
	}

	return { label, contains }
}

function parseTicket(rawTicket: string): Ticket {
	return rawTicket.split(',').map(Number)
}

function parseNotes(
	file: string
): { ranges: Range[]; ticket: Ticket; others: Ticket[] } {
	const [rawRanges, rawTicket, rawOthers] = inputAsGroupedStringArray(
		__dirname,
		file
	)
	const ranges = rawRanges.map(parseRange)
	const ticket = parseTicket(rawTicket[1])
	const others = rawOthers.slice(1).map(parseTicket)
	return { ranges, ticket, others }
}

// Part A
function calcScanningErrorRate(file: string): number {
	const { ranges, others } = parseNotes(file)
	const findInAnyRange = (n: number): boolean => {
		return ranges.some((range) => range.contains(n))
	}

	let rate = 0
	for (const ticket of others) {
		rate += ticket.reduce((acc, n) => acc + (findInAnyRange(n) ? 0 : n), 0)
	}
	return rate
}

logTest('A', calcScanningErrorRate('test.txt'))
logAnswer('A', calcScanningErrorRate('input.txt'))

// Part B
function getPossibleRanges(value: number, ranges: Range[]): string[] {
	return ranges.reduce((acc, range) => {
		if (range.contains(value)) acc.push(range.label)
		return acc
	}, [])
}

function validateTicket(ticket: Ticket, ranges: Range[]): boolean {
	return ticket.every((value) => {
		return getPossibleRanges(value, ranges).length > 0
	})
}

function discountImpossibleOptions(
	tickets: Ticket[],
	ranges: Range[]
): LabelOptions {
	const allLabels = ranges.map((range) => range.label)

	// Track all possible labels for each position
	const possibilities = allLabels.map(() => [...allLabels])

	// Narrow down possibilities
	for (const ticket of tickets) {
		ticket.forEach((value, index) => {
			const options = getPossibleRanges(value, ranges)
			possibilities[index] = possibilities[index].filter((label) => {
				return options.includes(label)
			})
		})
	}

	return possibilities
}

function removeOption(options: LabelOptions, toRemove: string): LabelOptions {
	return options.map((labels) => labels.filter((label) => label !== toRemove))
}

function narrowPossibilities(options: LabelOptions): string[] {
	const labels = Array(options.length).fill(undefined)
	let narrowed = clone(options)

	while (labels.some((label) => label === undefined)) {
		const onlyOption = narrowed.findIndex((opts) => opts.length === 1)
		if (onlyOption !== -1) {
			labels[onlyOption] = narrowed[onlyOption][0]
			narrowed = removeOption(narrowed, labels[onlyOption])
		}
	}

	return labels
}

function getDepartureProduct(file: string): number {
	const { ranges, ticket, others } = parseNotes(file)

	// Determine index of each range
	const validTickets = others.filter((other) => validateTicket(other, ranges))
	const possibilities = discountImpossibleOptions(validTickets, ranges)
	const labels = narrowPossibilities(possibilities)

	// Multiply departure fields
	return labels.reduce((acc, label, index) => {
		return label.startsWith('departure') ? acc * ticket[index] : acc
	}, 1)
}

logAnswer('B', getDepartureProduct('input.txt'))
