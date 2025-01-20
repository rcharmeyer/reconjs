import React, { Context, useMemo } from "react"
import { isRSC, resolveDispatcher } from "./react-internals"
import { theRoot } from "./root"
import { createCache, createSymbolizer } from "./symbolizer"

const getPromiseRef = createCache ((_: symbol) => {
	return {} as {
		current?: Promise <any>
	}
})

export function usePending <T> (promise: PromiseLike <T>): boolean {
	const future = asFuture (promise)

	function checkPending() {
		// @ts-expect-error
		return future.status === "pending"
	}

	if (isRSC()) return checkPending()

	const [ , setPending ] = React.useState (checkPending())

	React.useEffect (() => {
		console.log ("usePending")
		setPending (checkPending())
		future.then (() => {
			setPending (checkPending())
		})
	}, [ future ])

	return checkPending()
}

export function cache <F extends Function> (loader: F): F {
	const getSymbol = createSymbolizer()

	function getPromise (...args: any[]) {
		const symbol = getSymbol (...args)

		const ref = getPromiseRef (symbol)
		ref.current ??= asFuture (loader (...args))
		return ref.current
	}

	// @ts-expect-error
	return getPromise
}

// @ts-expect-error
const REACT_CONTEXT_TYPE = theRoot.$$typeof

type Usable <T> = PromiseLike <T> | Context <T>

/**
 * This is a backwards-compatible version of React's `use`.
 * 
 * @param usable - a promise or a context
 * @returns the value of the promise or the context
 */
export function use<T> (usable: Usable<T>): T {
	if (null !== usable && "object" === typeof usable) {
		const { readContext } = resolveDispatcher()
		// @ts-expect-error
		if ("function" === typeof usable.then) {
			return readFuture (usable as PromiseLike<T>)
		}
		// @ts-expect-error
		else if (usable.$$typeof === REACT_CONTEXT_TYPE) {
			return readContext (usable)
		}
	}
	throw Error("An unsupported type was passed to use(): " + String(usable));
}

// FUTURES

type Future <T> = PromiseLike <T> & {
	status: "pending" | "fulfilled" | "rejected",
	value?: T,
	reason?: any,
}

function readFuture <T> (promise: PromiseLike <T>): T {
	const future = asFuture (promise) as Future <T>
	
	if (future.status === "fulfilled") {
		return future.value as T
	}
	else if (future.status === "rejected") {
		throw future.reason
	}
	else if (future.status === "pending") {
		throw future
	}
	else {
		throw new Error ("Invalid future status: " + future.status)
	}
}

export function asFuture <T extends PromiseLike <any>> (promise: T): T {
	if (promise.hasOwnProperty ("status")) {
		return promise
	}

	const future = promise as any as Future <T>
	future.status = "pending"
	future.then (doFulfill (future), doReject (future))

	// @ts-expect-error
	return future
}

function doFulfill (future: Future <any>) {
	return (value: any) => {
		future.status = "fulfilled"
		future.value = value
	}
}

function doReject (future: Future <any>) {
	return (reason: any) => {
		future.status = "rejected"
		future.reason = reason
	}
}

export function fulfilled <T> (value: T): Promise <T> {
	const future: any = Promise.resolve (value)
	future.status = "fulfilled"
	future.value = value
	return future
}

function rejected <T> (reason: any): Promise <T> {
	const future: any = Promise.reject (reason)
	future.status = "rejected"
	future.reason = reason
	return future
}

export function usePromise <T> (loader: () => T|Promise<T>, deps: any[]): Promise <T> {
	return useMemo (() => {
		try {
			const result = loader()
			if (result instanceof Promise) {
				return asFuture (result)
			}
			else {
				return fulfilled (result)
			}
		}
		catch (thrown) {
			if (thrown instanceof Promise) {
				return asFuture (thrown)
			}
			else {
				return rejected (thrown)
			}
		}
	}, deps)
}
