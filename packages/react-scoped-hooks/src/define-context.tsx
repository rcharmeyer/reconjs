import React, { 
	ComponentType, 
	createContext, 
	memo, 
	MemoExoticComponent, 
	PropsWithChildren,
	ReactNode,
	use,
} from "react"
import { createCache } from "./symbolizer"

type AnyDefined = Exclude <any, undefined>

type Ctx <
	T extends AnyDefined = AnyDefined
> = React.Context <T>

type ChildProvider = MemoExoticComponent <
	ComponentType <PropsWithChildren>
>

export const theRoot = createContext (null)
theRoot.displayName = "theRoot"

const dependentsOf = createCache ((_: Ctx) => {
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

const getProvider = createCache ((ctx: Ctx) => {
	return memo (ctx.Provider)
})

export function Provider <C extends Ctx> (props: {
	children: React.ReactNode,
	context: C,
	value: React.ContextType <C>,
}): ReactNode

export function Provider <C extends Ctx> (props: {
	children: React.ReactNode,
	context: C,
	value: React.ContextType <C>,
}) {
	if (!props.context) return props.children

	const dependents = dependentsOf (props.context).get()
	let { children } = props

	for (const Wrapper of dependents) {
		children = <Wrapper>{children}</Wrapper>
	}

	const Provider = getProvider (props.context)

	return (
		<Provider value={props.value}>
			{children}
		</Provider>
	)
}

export function RootProvider (props: {
	children: React.ReactNode,
}) {
	return (
		<Provider context={theRoot} value={null}>
			{props.children}
		</Provider>
	)
}

export function defineContext <T extends AnyDefined> (
	useContextValue: () => T,
	deps: Ctx[],
) {
	deps = [ theRoot, ...deps ]
	const context = createContext <T> (undefined as any)

	function HoistedContext (props: PropsWithChildren) {
		const value = useContextValue()

		const ContextProvider = getProvider (context)
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

	const provider = memo (HoistedProvider)
	for (const dep of deps) {
		dependentsOf (dep).add (provider)
	}

	return context
}
