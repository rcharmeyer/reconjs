import { useSuspenseQuery } from "@tanstack/react-query"

export enum Color {
	Red = "red",
	Green = "green",
	Blue = "blue",
}

function getImageUrl (color: Color) {
	return `https://picsum.photos/200/300?random=${color}`
}

async function loadColors () {
	return [ Color.Red, Color.Green, Color.Blue ]
}

async function loadImages() {
	let images = {} as Record<Color, string>

	const colors = await loadColors()
	for (const color of colors) {
		images[color] = await fetch (getImageUrl (color)).then (res => res.url)
	}

	return images
}

export function useProductColors() {
	const query = useSuspenseQuery ({
		queryKey: ["product", "colors"],
		queryFn: loadColors,
	})

	return query.data
}

export function useProductImages () {
	const query = useSuspenseQuery ({
		queryKey: ["product", "images"],
		queryFn: loadImages,
	})

	return query.data
}