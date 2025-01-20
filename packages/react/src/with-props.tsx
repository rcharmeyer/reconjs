import { ElementType, memo } from "react"
import { PropsOf } from "./types"

export function withProps <C extends ElementType> (
	component: C, 
	defaultProps: any
) {
	const Component = component

	function WithProps (props: PropsOf <C>) {
		return <Component {...defaultProps} {...props} />
	}
	
	return memo (WithProps)
}
