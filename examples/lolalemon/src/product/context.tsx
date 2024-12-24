import { createContext } from "react"
import { setDisplayNames } from "@reconjs/react"

export const theProduct = createContext <string> (undefined as any)

setDisplayNames ({ theProduct })

export enum Color {
	Red = "232",
	Green = "233",
	Blue = "234",
}
