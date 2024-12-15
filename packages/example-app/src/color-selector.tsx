import { use, useState } from 'react'
import { defineContext } from 'react-scoped-hooks'
import { Color, useProductColors } from './product-queries'
import { ProductProvider } from './providers'

export const ColorStateContext = defineContext ("ColorState", () => {
	const [ defaultColor ] = useProductColors()
	const [ color, setColor ] = useState <Color> (defaultColor)
	return { color, setColor }
}, [ ProductProvider ])

function ColorSelectorItem (props: { color: Color }) {
	const { setColor } = use (ColorStateContext)

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
	const colors = useProductColors()
	return (
		<div className="flex flex-row gap-4">
			{colors.map (color => <ColorSelectorItem key={color} color={color} />)}
		</div>
	)
}
