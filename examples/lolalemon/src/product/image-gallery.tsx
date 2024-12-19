import { use, useMemo } from 'react'
import { defineContext } from '@reconjs/react'

import { loadImages } from './queries'
import { theColorState } from './color-selector'
import { theProduct } from './context'

const theActiveImage = defineContext (() => {
	const product = use (theProduct)
	const images = use (loadImages (product))


	const { color } = use (theColorState)
	return useMemo (() => {
		return images[color] ?? null
	}, [ color ])
}, [ theProduct ])

theActiveImage.displayName = "theActiveImage"

export function ImageGallery () {
	const image = use (theActiveImage)
	return <img src={image} alt="Product" />
}