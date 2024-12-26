import { memo, useMemo } from "react"
import { Component, StyleOf } from "./types"

type AnyFunction = (...args: any[]) => any

function arrayify <T> (value: T[]): T[]
function arrayify <T> (value: T): T[] {
	return Array.isArray (value) ? value : [ value ]
}

export function withStyle <C extends Component> (
	component: C,
	defaultStyle: Exclude <StyleOf <C>, AnyFunction|any[]>
) {
	const Component = typeof component === "function" 
		? memo (component)
		: component

	function getDisplayName () {
		if (typeof component === "string") return component
		return component.displayName ?? component.name ?? "Unknown"
	}

	function WithStyle (props: any) {
		// @ts-expect-error
		WithStyle.displayName ??= `withStyle(${getDisplayName()})`

		const style = useMemo (() => {
			return [ defaultStyle, ...arrayify (props.style) ]
		}, [ props.style ])

		return <Component {...props} style={style} />
	}

	return memo (WithStyle as C)
}
