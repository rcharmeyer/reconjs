import { createContext as createReactContext } from "react"

export function createContext <T> (defaultValue?: T) {
	return createReactContext <T> (defaultValue as any)
}