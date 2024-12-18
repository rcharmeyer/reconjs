import { use, useState } from 'react'
import { defineContext } from '@reconjs/react'
import { Color, loadColors } from './queries'
import { theProduct } from './context'

export const theColorState = defineContext (() => {
	const product = use (theProduct)
	const [ defaultColor ] = use (loadColors (product))
	const [ color, setColor ] = useState (defaultColor)
	return { color, setColor }
}, [ theProduct ])

theColorState.displayName = "theColorState"

function ColorSelectorItem (props: { color: Color }) {
	const { setColor } = use (theColorState) ?? {}

	function onClick () {
		setColor (props.color)
	}

	return (
		<button onClick={onClick}>
			{props.color}
		</button>
	)
}

export function ColorSelector () {
	const product = use (theProduct)
	const colors = use (loadColors (product))
	return (
		<div className="flex flex-row gap-4">
			{colors.map (color => <ColorSelectorItem key={color} color={color} />)}
		</div>
	)
}
