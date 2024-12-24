import { createContext, useState, useContext } from 'react'
import { use, defineContext, setDisplayNames, cache } from '@reconjs/react'
import { Color, theProduct } from './context'

async function timeout (ms: number) {
	return new Promise (resolve => setTimeout (resolve, ms))
}

export const theColorsLoader = createContext (cache (async (_: string) => {
	await timeout (1000)
	return [ Color.Red, Color.Green, Color.Blue ]
}))

export const theColorState = defineContext (() => {
	const product = useContext (theProduct)
	const loadColors = useContext (theColorsLoader)
	const [ defaultColor ] = use (loadColors (product))

	const [ color, setColor ] = useState (defaultColor)
	return { color, setColor }
}, [ theProduct ])

setDisplayNames ({ theColorState, theColorsLoader })



const NAMES = {
	[ Color.Red ]: "Red",
	[ Color.Green ]: "Green",
	[ Color.Blue ]: "Blue",
}

function ColorSelectorItem (props: { color: Color }) {
	const { setColor } = useContext (theColorState) ?? {}

	function onClick () {
		setColor (props.color)
	}

	return (
		<button onClick={onClick}>
			{NAMES[props.color]}
		</button>
	)
}

export function ColorSelector () {
	const product = useContext (theProduct)
	const loadColors = useContext (theColorsLoader)
	const colors = use (loadColors (product))
	return (
		<div className="flex flex-row gap-4">
			{colors.map (color => <ColorSelectorItem key={color} color={color} />)}
		</div>
	)
}
