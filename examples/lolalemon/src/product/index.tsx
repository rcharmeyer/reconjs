import { cache, Provider, use, useLoader } from '@reconjs/react'
import { ColorSelector, theColorsLoader } from './color-selector'
import { Color, theProduct } from './context'
import { ImageGallery, theImageLoader } from './image-gallery'
import { ReactNode } from 'react'

async function timeout (ms: number) {
	return new Promise (resolve => setTimeout (resolve, ms))
}

const loadProduct = cache (async (slug: string) => {
	await timeout (1000)
	if (slug !== "align-25") {
		throw new Error ("Product not found")
	}
	return {
		id: "a-25",
		colors: [ Color.Red, Color.Green, Color.Blue ],
		images: {
			[ Color.Red ]: "https://picsum.photos/id/232/200/300",
			[ Color.Green ]: "https://picsum.photos/id/233/200/300",
			[ Color.Blue ]: "https://picsum.photos/id/234/200/300",
		}
	}
})

function ProductDataProvider (props: {
	slug: string,
	children: ReactNode,
}) {
	const data = use (loadProduct (props.slug))

	const loadColors = useLoader ((id: string) => {
		if (id === data.id) return data.colors
		throw new Error ("Product not found")
	})

	const loadImage = useLoader ((color: Color) => {
		if (data.images[color]) return data.images[color]
		throw new Error ("Image not found")
	})

	return (
		<Provider context={theColorsLoader} value={loadColors}>
			<Provider context={theImageLoader} value={loadImage}>
				<Provider context={theProduct} value={data.id}>
					{props.children}
				</Provider>
			</Provider>
		</Provider>
	)
}

function ProductView (props: {
	slug: string,
}) {
	return (
		<ProductDataProvider slug={props.slug}>
			<div className="bg-white border border-gray-200 p-8 rounded-lg shadow-md">
				<h2 className="text-xl">Product</h2>
				<ColorSelector />
				<ImageGallery />
			</div>
		</ProductDataProvider>
	)
}

export function App() {
  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold mb-4">Recon Example</h1>
			<ProductView slug="align-25" />
    </div>
  )
}