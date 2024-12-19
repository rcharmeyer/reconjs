import { createContext } from "react"

export const theProduct = createContext <string> ("")
theProduct.displayName = "theProduct"
