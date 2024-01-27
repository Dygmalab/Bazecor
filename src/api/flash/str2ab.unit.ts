import { expect, it } from 'vitest'
import { str2ab } from './str2ab'

it('converts input string to an ArrayBuffer', () => {
	const r = str2ab('')
	expect(r).instanceOf(ArrayBuffer)
})