import { createContext } from "react"
import { setDisplayNames } from "@reconjs/react"

export const theProduct = createContext <string> (undefined as any)

setDisplayNames ({ theProduct })
