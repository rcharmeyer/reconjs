"use client"
import { 
	Context,
	createContext, 
	DependencyList, 
	PropsWithChildren, 
	useContext, 
	useEffect, 
	useReducer, 
	useRef,
} from "react"

interface Entry {
	key: string,
	deps: DependencyList,
	value: any,
}

function reducer (state: Entry[], action: Entry) {
	const nextState = state.filter (x => x.key !== action.key)
	return [ ...nextState, action ]
}

function useScopeProvider () {
	const [state, dispatch] = useReducer (reducer, [] as Entry[])
	const cache = useRef ([] as Entry[])
	cache.current = state

	return {
		state,
		dispatch,
		cache,
	}
}

const CONTEXTS = [] as Array <{
	context: Context <ReturnType <typeof useScopeProvider>>,
	scope: Function,
}>

function findContext (scope: Function) {
	return CONTEXTS.find (x => x.scope === scope)?.context
}

export function createScope () {
	const Context = createContext <
		ReturnType <typeof useScopeProvider>
	> (undefined as any)

	function Scope (props: PropsWithChildren) {
		const value = useScopeProvider()

		return (
			<Context.Provider value={value}>
				{props.children}
			</Context.Provider>
		)
	}

	CONTEXTS.push ({
		context: Context, 
		scope: Scope,
	})

	return Scope
}

export const ROOT = createScope()
const ROOT_CONTEXT = findContext (ROOT)

export function ScopeProvider (props: PropsWithChildren) {
	return <ROOT>{props.children}</ROOT>
}

function getContext (deps: DependencyList) {
	for (const dep of deps) {
		const found = findContext (dep as any)
		if (found) return found
	}
	if (!ROOT_CONTEXT) throw new Error ("Root scope not found")
	return ROOT_CONTEXT
}

export function useScopedState <T> (
	key: string, 
	initializer: () => T, 
	deps: DependencyList = [],
) {
	const Context = getContext (deps)
	const { cache, dispatch, state } = useContext (Context)

	// TODO: Dedupe using deps too.
	let entry = cache.current.find (entry => entry.key === key)
	let initial: Entry | undefined

	if (!entry) {
		const value = initializer()
		function setValue (next: any) {
			dispatch ({ key, deps, value: [ next, setValue ] })
		}

		initial = { key, deps, value: [ value, setValue ] }
		entry = initial
		cache.current.push (initial)
	}

	useEffect (() => {
		if (initial) {
			dispatch (initial)
		}
	}, [ initial ])

	if (!entry) throw new Error ("Entry not found")
	return entry.value as [ T, (value: T) => void ]
}