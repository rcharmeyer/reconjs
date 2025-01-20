import { createContext, useContext } from 'react'
import { cache, defineContext, setDisplayNames, use, usePending } from '@reconjs/react'

import { theColorState } from './color-selector'
import { Color, theProduct } from './context'

function getImageUrl (color: Color) {
	return `https://picsum.photos/id/${color}/200/300`
}

async function timeout (ms: number) {
	return new Promise (resolve => setTimeout (resolve, ms))
}

export const theImageLoader = createContext (cache (async (color: Color) => {
	console.log ("[default] loading image for", color)
	await timeout (5000)
	return getImageUrl (color)
}))

const theActiveImage = defineContext (() => {
	const { color } = useContext (theColorState)
	const loadImage = useContext (theImageLoader)

	const _image = loadImage (color)
	const isPending = usePending (_image)
	return isPending ? null : use (_image)
}, [ theProduct ])

function ImageInner () {
	const image = useContext (theActiveImage)
	if (image === null) {
		return <div>Loading...</div>
	}
	return <img src={image} alt="Product" />
}

export function ImageGallery () {
	return <ImageInner />
}

setDisplayNames ({ theActiveImage, theImageLoader })