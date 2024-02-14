import { describe, expect, it } from 'vitest'
import { LoggingFocusSpy } from './Focus.mocks'

describe(`debugLog()`, () => {
	it('is disabled by default', () => {
		const s = new LoggingFocusSpy()
		s.debugLog('abc')
		expect(s.logs.length).toBe(0)
	})

	it('is enabled when debug is true', () => {
		const s = new LoggingFocusSpy()
		s.debug = true
		s.debugLog('abc')
		expect(s.logs).toEqual([['log', 'abc']])
	})
})