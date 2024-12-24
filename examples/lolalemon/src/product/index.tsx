import { cache, handleContext, Provider, use, useLoader } from '@reconjs/react'
import { ColorSelector, theColorsLoader } from './color-selector'
import { Color, theProduct } from './context'
import { ImageGallery, theImageLoader } from './image-gallery'
import { useContext } from 'react'

async function timeout (ms: number) {
	return new Promise (resolve => setTimeout (resolve, ms))
}

const loadProduct = cache (async (product: string) => {
	await timeout (1000)
	if (product !== "align-25") {
		throw new Error ("Product not found")
	}
	return {
		colors: [ Color.Red, Color.Green, Color.Blue ],
		images: {
			[ Color.Red ]: "https://picsum.photos/id/232/200/300",
			[ Color.Green ]: "https://picsum.photos/id/233/200/300",
			[ Color.Blue ]: "https://picsum.photos/id/234/200/300",
		}
	}
})

handleContext (theColorsLoader, () => {
	const product = useContext (theProduct)
	const data = use (loadProduct (product))
	return useLoader (() => data.colors)
}, [ theProduct ])

handleContext (theImageLoader, () => {
	const product = useContext (theProduct)
	const data = use (loadProduct (product))
	return useLoader ((color: Color) => data.images[color])
}, [ theProduct ])

function ProductView () {
	return (
		<div className="bg-white border border-gray-200 p-8 rounded-lg shadow-md">
			<h2 className="text-xl">Product</h2>
			<ColorSelector />
			<ImageGallery />
		</div>
	)
}

export function App() {
  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold mb-4">Recon Example</h1>
			<Provider context={theProduct} value="align-25">
				<ProductView />
			</Provider>
    </div>
  )
}