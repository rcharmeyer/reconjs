import { cache } from "@reconjs/react"

export enum Color {
	Red = "red",
	Green = "green",
	Blue = "blue",
}

function getImageUrl (color: Color) {
	return `https://picsum.photos/200/300?random=${color}`
}

export const loadColors = cache (async (product: string) => {
	return [ Color.Red, Color.Green, Color.Blue ]
})

export const loadImages = cache (async (product: string) => {
	let images = {} as Record<Color, string>

	const colors = await loadColors (product)
	for (const color of colors) {
		images[color] = getImageUrl (color)
	}

	return images
})
