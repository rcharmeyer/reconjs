import { createContext as createReactContext } from "react"

export function createContext <T>() {
	return createReactContext <T> (undefined as any)
}
