import { createContext } from "react"
import { setDisplayNames } from "./display-names"

export const theRoot = createContext (null)
setDisplayNames ({ theRoot })
