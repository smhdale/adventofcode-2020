import { inputAsStringArray, logAnswer } from '../helpers'

// Setup
type Operation = 'acc' | 'jmp' | 'nop'
type Instruction = { op: Operation; value: number }
type RunResult = { error: string | null; accumulator: number }

function parseRawInstruction(rawInstruction: string): Instruction {
	const [, op, rawValue] = rawInstruction.match(/([a-z]{3}) ([+-]\d+)/)
	return {
		op: op as Operation,
		value: Number(rawValue),
	}
}

// Compiles and runs handheld console boot code
function compileAndRun(instructions: Instruction[]): RunResult {
	const seenStates: Set<number> = new Set()

	// Track program state
	let cursor = 0
	let accumulator = 0

	// Run program until completion or error
	while (cursor < instructions.length) {
		// Track that we've seen this instruction
		seenStates.add(cursor)

		// Parse and execute the instruction
		const { op, value } = instructions[cursor]
		switch (op) {
			case 'acc':
				accumulator += value
				cursor += 1
				break
			case 'jmp':
				cursor += value
				break
			case 'nop':
				cursor += 1
				break
			default:
				return {
					error: `Unrecognised operation: ${op}`,
					accumulator,
				}
		}

		if (seenStates.has(cursor)) {
			// Throw error if we hit an infinite loop
			return {
				error: `Infinite loop at instruction ${cursor}`,
				accumulator,
			}
		} else if (cursor < 0 || cursor > instructions.length) {
			// Throw error if execution went out of bounds
			return {
				error: `Execution out of bounds at ${cursor}`,
				accumulator,
			}
		}
	}

	return {
		error: null,
		accumulator,
	}
}

// Part A
const instructions = inputAsStringArray(__dirname, 'input.txt').map(
	parseRawInstruction
)
const resultA = compileAndRun(instructions)
logAnswer('A', resultA)

// Part B
function attemptRepair(): RunResult {
	// Repairs an instruction by swapping `jmp` <=> `nop`
	const repairInstruction = ({ op, value }: Instruction): Instruction => {
		switch (op) {
			case 'jmp':
				return { op: 'nop', value }
			case 'nop':
				return { op: 'jmp', value }
			default:
				return { op, value }
		}
	}

	// Repairs an instruction at a given index
	const repairInstructionAt = (index: number): Instruction[] => {
		return [
			...instructions.slice(0, index),
			repairInstruction(instructions[index]),
			...instructions.slice(index + 1),
		]
	}

	let swapCursor = 0
	while (swapCursor < instructions.length) {
		// Attmept to repair possibly incorrect instructions
		if (['jmp', 'nop'].includes(instructions[swapCursor].op)) {
			const result = compileAndRun(repairInstructionAt(swapCursor))
			if (result.error === null) return result
		}
		swapCursor++
	}

	return {
		error: 'Failed to repair the program',
		accumulator: null,
	}
}
const resultB = attemptRepair()
logAnswer('B', resultB)
