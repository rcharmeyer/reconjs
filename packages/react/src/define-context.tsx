import { 
	ComponentType, 
	Context, 
	ContextType, 
	createContext,
	memo, 
	MemoExoticComponent, 
	PropsWithChildren,
} from "react"
import { use } from "./use"
import { createCache } from "./symbolizer"
import { theRoot } from "./root"
import { isRSC } from "./react-internals"

type ChildProvider = MemoExoticComponent <
	ComponentType <PropsWithChildren>
>

export const dependentsOf = createCache ((_: Context<any>) => {
	const list = [] as ChildProvider[]

	let locked = false

	return {
		add: (provider: ChildProvider) => {
			if (locked) {
				throw new Error ("Cannot add dependent provider after context has been locked")
			}
			list.unshift (provider)
		},
		get: () => {
			locked = true
			return list
		}
	}
})

export function handleContext <C extends Context <any>> (
	context: C,
	useContextValue: () => ContextType <C>,
	deps: Context<any>[] = [],
) {
	if (isRSC()) {
		throw new Error ("handleContext must be called in a client component.")
	}

	deps = [ theRoot, ...deps ]
	for (const dep of deps) {
		// @ts-expect-error
		if (dep.defaultValue !== undefined) {
			// console.warn ("handleContext expects all dependencies to have undefined default values.")
		}
	}

	const ContextProvider = memo (context.Provider)

	function HoistedContext (props: PropsWithChildren) {
		const value = useContextValue()

		return (
			<ContextProvider value={value}>
				{props.children}
			</ContextProvider>
		)
	}

	const MemoizedContext = memo (HoistedContext)

	function HoistedProvider (props: PropsWithChildren) {
		const inContexts = deps
			.every (ctx => use (ctx) !== undefined)

		if (!inContexts) return props.children

		return (
			<MemoizedContext>
				{props.children}
			</MemoizedContext>
		)
	}

	const MemoizedProvider = memo (HoistedProvider)
	for (const dep of deps) {
		dependentsOf (dep).add (MemoizedProvider)
	}
}

export function defineContext <T = undefined> (
	useContextValue?: () => T, 
	deps?: Context<any>[],
): Context<T> {
	if (isRSC()) {
		throw new Error ("defineContext must be called in a client component.")
	}

	const context = createContext <T> (undefined as any)
	if (useContextValue) {
		handleContext (context, useContextValue, deps)
	}
	return context as any
}