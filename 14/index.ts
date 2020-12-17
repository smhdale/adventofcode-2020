import { inputAsStringArray, logTest, logAnswer } from '../helpers'

// Setup
type Memory = Map<bigint, bigint>
type Bit = '0' | '1' | 'X'
type Mask = Bit[]
type MemInstruction = {
	register: bigint
	value: bigint
}

function parseMask(raw: string): Mask {
	return raw.replace('mask = ', '').split('') as Mask
}

function parseMem(raw: string): MemInstruction {
	const [, reg, val] = raw.match(/\[(\d+)\] = (\d+)/)
	return {
		register: BigInt(reg),
		value: BigInt(val),
	}
}

function parseInstruction(raw: string): Mask | MemInstruction {
	if (raw.startsWith('mask')) {
		return parseMask(raw)
	} else {
		return parseMem(raw)
	}
}

function parseInstructions(file: string) {
	return inputAsStringArray(__dirname, file).map(parseInstruction)
}

function isMask(inst: Mask | MemInstruction): inst is Mask {
	return Array.isArray(inst)
}

function sumMemory(mem: Memory): bigint {
	return [...mem.values()].reduce((acc, v) => acc + v, BigInt(0))
}

function createBitmask(
	mask: Mask,
	cb: (bit: string, index: number) => string
): bigint {
	return BigInt('0b' + mask.map(cb).join(''))
}

// Part A
function interpretMaskA(mask: Mask): (n: bigint) => bigint {
	const or = createBitmask(mask, (bit) => (bit === 'X' ? '0' : bit))
	const and = createBitmask(mask, (bit) => (bit === '0' ? '0' : '1'))
	return (n) => (n | or) & and
}

function initA(file: string): Memory {
	const instructions = parseInstructions(file)
	const mem: Memory = new Map()
	let maskFn: (n: bigint) => bigint

	for (const inst of instructions) {
		if (isMask(inst)) maskFn = interpretMaskA(inst)
		else mem.set(inst.register, maskFn(inst.value))
	}

	return mem
}

const testMemA = initA('testA.txt')
logTest('A', sumMemory(testMemA))

const realMemA = initA('input.txt')
logAnswer('A', sumMemory(realMemA))

// Part B
function interpretMaskB(mask: Mask): (n: bigint) => bigint[] {
	const or = createBitmask(mask, (bit) => (bit === 'X' ? '0' : bit))
	const floatingBitIndices = mask.reduce((acc, bit, index) => {
		return bit === 'X' ? [...acc, index] : acc
	}, [])
	const numFloatingBits = floatingBitIndices.length
	const variations = 2 ** numFloatingBits

	const asMask = (n: number | bigint, size = 36) => {
		return [...n.toString(2).padStart(size, '0')] as Mask
	}

	return (n: bigint) => {
		// Create base mask
		const base = asMask(n | or)
		const masks: bigint[] = []

		// Iterate through all mask combos
		for (let i = 0; i < variations; i++) {
			const bits = asMask(i, numFloatingBits)
			masks.push(
				createBitmask(base, (bit, index) => {
					return floatingBitIndices.includes(index) ? bits.shift() : bit
				})
			)
		}

		return masks
	}
}

function initB(file: string): Memory {
	const instructions = parseInstructions(file)
	const mem: Memory = new Map()
	let maskFn: (n: bigint) => bigint[]

	for (const inst of instructions) {
		if (isMask(inst)) maskFn = interpretMaskB(inst)
		else {
			const registers: bigint[] = maskFn(inst.register)
			for (const reg of registers) mem.set(reg, inst.value)
		}
	}

	return mem
}

const testMemB = initB('testB.txt')
logTest('B', sumMemory(testMemB))

const realMemB = initB('input.txt')
logAnswer('B', sumMemory(realMemB))
