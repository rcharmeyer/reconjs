import React from "react"
import { cache as compatible_cache } from "./promises"

let cache: <T extends Function>(fn: T) => T

// @ts-expect-error
if (React.cache) {
	// @ts-expect-error
	cache = React.cache
}
else {
	cache = compatible_cache
}

export { cache }