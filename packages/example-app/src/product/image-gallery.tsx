import { use, useMemo } from 'react'
import { defineContext } from 'react-scoped-hooks'

import { useProductImages } from './product-queries'
import { ColorStateContext } from './color-selector'
import { ProductProvider } from './providers'

const ActiveImageContext = defineContext ("ActiveImage", () => {
	const images = useProductImages()
	const { color } = use (ColorStateContext)
	return useMemo (() => {
		return images[color] ?? null
	}, [ color ])
}, [ ProductProvider ])

export function ImageGallery () {
	const image = use (ActiveImageContext)
	return <img src={image} alt="Product" />
}