import React from "react"
import { use as compatible_use } from "./promises"

let use: typeof compatible_use

// @ts-ignore
if (React.use) {
	// @ts-ignore
	use = React.use
}
// @ts-ignore
else if (React.experimental_use) {
	// @ts-ignore
	use = React.experimental_use
}
else {
	use = compatible_use
}

export { use }
