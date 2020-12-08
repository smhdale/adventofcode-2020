import { inputAsGroupedStringArray, logTest, logAnswer } from '../helpers'

// Setup
type Height = {
	value: number
	unit: string
}
type Passport = {
	byr?: number
	iyr?: number
	eyr?: number
	hgt?: Height
	hcl?: string
	ecl?: string
	pid?: string
	cid?: string
}
const passportKeys: Array<keyof Passport> = [
	'byr',
	'iyr',
	'eyr',
	'hgt',
	'hcl',
	'ecl',
	'pid',
	'cid',
]

function parseHeight(raw: string) {
	const [, value, unit] = raw.match(/(\d+)(cm|in)/) || []
	return { value, unit }
}
function createPassportFromRaw(raw: string): Passport {
	const fields = raw.split(' ').map((keypair) => {
		const [key, value] = keypair.split(':')
		return { key, value }
	})
	const getKeyValueFromRaw = (key: keyof Passport) => {
		const raw = fields.find((field) => field.key === key)
		if (!raw) return undefined
		switch (key) {
			case 'byr':
			case 'iyr':
			case 'eyr':
				return Number(raw.value)
			case 'hgt':
				return parseHeight(raw.value)
			default:
				return raw.value
		}
	}
	return passportKeys.reduce((passport, key) => {
		passport[key] = getKeyValueFromRaw(key)
		return passport
	}, {})
}

function createPassportsFromRaw(file: string): Passport[] {
	return inputAsGroupedStringArray(__dirname, file).map((rawPassport) =>
		createPassportFromRaw(rawPassport.join(' '))
	)
}

const testPassports = createPassportsFromRaw('test.txt')
const realPassports = createPassportsFromRaw('input.txt')

// Part A
function testPassportA(passport: Passport) {
	const requiredKeys: Array<keyof Passport> = [
		'byr',
		'iyr',
		'eyr',
		'hgt',
		'hcl',
		'ecl',
		'pid',
	]
	return requiredKeys.every((key) => passport[key] !== undefined)
}
const validTestPassportsA = testPassports.filter(testPassportA)
const validRealPassportsA = realPassports.filter(testPassportA)
logTest('A', validTestPassportsA.length)
logAnswer('A', validRealPassportsA.length)

// Part B
function inNumericRange(v: number, min: number, max: number): boolean {
	return v && !isNaN(v) && v >= min && v <= max
}
function validHeight(v: Height): boolean {
	if (!v) return false
	switch (v.unit) {
		case 'in':
			return inNumericRange(v.value, 59, 76)
		case 'cm':
			return inNumericRange(v.value, 150, 193)
		default:
			return false
	}
}
function validHex(v: string): boolean {
	return /^#[0-9a-f]{6}$/i.test(v)
}
function validEyeColor(v: string): boolean {
	return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v)
}
function validPassportID(v: string): boolean {
	return /^\d{9}$/.test(v)
}

function testPassportB({ byr, iyr, eyr, hgt, hcl, ecl, pid }: Passport) {
	return (
		inNumericRange(byr, 1920, 2002) &&
		inNumericRange(iyr, 2010, 2020) &&
		inNumericRange(eyr, 2020, 2030) &&
		validHeight(hgt) &&
		validHex(hcl) &&
		validEyeColor(ecl) &&
		validPassportID(pid)
	)
}

const validRealPassportsB = realPassports.filter(testPassportB)
logAnswer('B', validRealPassportsB.length)
