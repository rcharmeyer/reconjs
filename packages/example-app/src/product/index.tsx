import { ColorSelector } from './color-selector'
import { ProductProvider } from './providers'
import { ImageGallery } from './image-gallery'

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
      <h1 className="text-2xl font-bold mb-4">React Scoped Hooks Example</h1>
			<ProductProvider>
				<ProductView />
			</ProductProvider>
    </div>
  )
} 