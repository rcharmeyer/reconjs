import { createCache, createSymbolizer } from "./symbolizer"

type Fanc <T = any, A extends any[] = any[]> = (...args: A) => Promise <T>

const getPromiseRef = createCache ((_: symbol) => {
	return {} as {
		current?: Promise <any>
	}
})

export function cache <F extends Fanc> (loader: F): F {
	const getSymbol = createSymbolizer()

	function getPromise (...args: any[]) {
		const symbol = getSymbol (...args)

		const ref = getPromiseRef (symbol)
		ref.current ??= loader (...args)
		return ref.current
	}

	return getPromise as any
}