/**
 * A symbolizer can be used to create a unique symbol for a given set of arguments.
 * 
 * @returns A function that can be used to get the symbol.
 * 
 * @example
 * // A symbolizer can be used for memoization.
 * 
 * function memoize (func) {
 * 	const getSymbol = createSymbolizer()
 * 	const cache = new Map()
 * 
 * 	return function (...args) {
 * 		const symbol = getSymbol (args)
 * 		if (!cache.has (symbol)) {
 * 			cache.set (symbol, func (...args))
 * 		}
 * 		return cache.get (symbol)
 * 	}
 * }
 */
export function createSymbolizer() {
	const START = Symbol()

	const cacheBy = createCache (() => {
		return createCache (() => Symbol())
	})

	function getNextSymbol (symbol: symbol, arg: any) {
		const symbolBy = cacheBy (symbol)
		return symbolBy (arg)
	}

	return function getSymbol (...args: any[]) {
		args = trimArray (args)
		let symbol = START

		for (const arg of args) {
			symbol = getNextSymbol (symbol, arg)
		}

		return symbol
	}
}

type Func1 = (arg: any) => any

/**
 * Create a cache that can be used to store values.
 * 
 * @param factory - The factory function to create the value.
 * @returns A function that can be used to get the value.
 * 
 * @example
 * const getInitialTimestamp = createCache (() => Date.now().utc())
 * getTimestamp ("user-4858") // always returns the same timestamp
 */
export function createCache <F extends Func1> (
	factory: F
) {
	type A = Parameters <F> [0]
	type T = ReturnType <F>

	const cache = new Map <A, T>()

	return function get (arg: any): T {
		if (!cache.has (arg)) {
			cache.set (arg, factory (arg))
		}
		// @ts-expect-error
		return cache.get (arg)
	}
}

/**
 * Remove undefined values from the end of an array.
 * 
 * @param array - The array to trim.
 * @returns The trimmed array.
 * 
 * @example
 * 
 * const array = [ 1, undefined, 3, undefined ]
 * trimArray (array) // [ 1, undefined, 3 ]
 */
function trimArray (array: any[]) {
	for (let i = array.length - 1; i >= 0; i--) {
		if (array[i] !== undefined) return array.slice (0, i + 1)
	}
	return []
}