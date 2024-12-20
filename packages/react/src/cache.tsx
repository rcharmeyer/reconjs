import React from "react"
import { cache as compatible_cache } from "./promises"

let cache: typeof React.cache

if (React.cache) {
	cache = React.cache
}
else {
	cache = compatible_cache
}

export { cache }