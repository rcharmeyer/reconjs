"use client"
import { Context, memo } from "react"
import { dependentsOf } from "./define-context"

export function Provider <C extends Context<any>> (props: {
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

	const ContextProvider = memo (props.context.Provider)

	return (
		<ContextProvider value={props.value}>
			{children}
		</ContextProvider>
	)
}