import { inputAsStringArray, sumEach, logTest, logAnswer } from '../helpers'

// Setup
const OUR_BAG = 'shiny gold'
type Bag = {
	type: string
	contents: { bag: Bag; count: number }[]
}

function parseRule(rule: string) {
	const [, parentType, childRules] = rule.match(
		/^([a-z ]+?) bags contain ([^.]+)/
	)

	// No children
	if (childRules === 'no other bags') return { parentType, children: [] }

	// Has children; parse rules
	const children = childRules.split(', ').map((childRule) => {
		const [, rawCount, childType] = childRule.match(/^(\d+) ([a-z ]+) bags?/)
		return { childType, count: Number(rawCount) }
	})
	return { parentType, children }
}

function createBags(file: string): Bag[] {
	const rules = inputAsStringArray(__dirname, file)
	const bags: Bag[] = []

	const getOrAddBag = (type: string): Bag => {
		const existing = bags.find((bag) => bag.type === type)
		if (existing) {
			return existing
		} else {
			const newBag = { type, contents: [] }
			bags.push(newBag)
			return newBag
		}
	}

	const addChildBag = (
		parentType: string,
		childType: string,
		count: number
	) => {
		getOrAddBag(parentType).contents.push({
			bag: getOrAddBag(childType),
			count,
		})
	}

	for (const rule of rules) {
		const parsedRule = parseRule(rule)
		for (const { childType, count } of parsedRule.children) {
			addChildBag(parsedRule.parentType, childType, count)
		}
	}

	return bags
}

// Init all bags
const testBags = createBags('test.txt')
const realBags = createBags('input.txt')

// Part A
function canContain(bag: Bag, type: string) {
	return bag.contents.some((child) => {
		return child.bag.type === type || canContain(child.bag, type)
	})
}

const testBagsWithOurBag = sumEach(testBags, (bag) => canContain(bag, OUR_BAG))
logTest('A', testBagsWithOurBag)

const realBagsWithOurBag = sumEach(realBags, (bag) => canContain(bag, OUR_BAG))
logAnswer('A', realBagsWithOurBag)

// Part B
function countContents(bag: Bag): number {
	if (bag.contents.length === 0) return 0
	return sumEach(bag.contents, (child) => {
		return child.count + child.count * countContents(child.bag)
	})
}
const getOurBag = (bags: Bag[]) => bags.find((bag) => bag.type === OUR_BAG)

const testBagsInOurBag = countContents(getOurBag(testBags))
logTest('B', testBagsInOurBag)

const realBagsInOurBag = countContents(getOurBag(realBags))
logAnswer('B', realBagsInOurBag)
