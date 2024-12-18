import { use, useCallback, useState } from "react"
import { defineContext } from "@reconjs/react"
import { theProduct } from "./context"

const theFavoritingStates = defineContext (() => {
	const [ favorites, setFavorites ] = useState <string[]> ([])

	function addFavorite (product: string) {
		setFavorites(f => [...f, product])
	}

	function removeFavorite (product: string) {
		setFavorites(f => f.filter (f => f !== product))
	}

	return {
		favorites,
		addFavorite,
		removeFavorite,
	}
}, [])

theFavoritingStates.displayName = "theFavoritingStates"

export const theFavoritingState = defineContext (() => {
	const { favorites, addFavorite, removeFavorite } = use (theFavoritingStates)
	const product = use (theProduct)

	const onFavorite = useCallback (() => {
		addFavorite (product)
	}, [ addFavorite, product ])

	const onUnfavorite = useCallback (() => {
		removeFavorite (product)
	}, [ removeFavorite, product ])

	return {
		isFavorite: favorites.includes (product),
		onFavorite,
		onUnfavorite,
	}
}, [ theProduct, theFavoritingStates ])

theFavoritingState.displayName = "theFavoritingState"

