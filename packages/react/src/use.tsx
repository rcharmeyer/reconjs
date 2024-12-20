import React from "react"
import { use as compatible_use } from "./promises"

let use: typeof React.use

if (React.use) {
	use = React.use
}
// @ts-expect-error
else if (React.experimental_use) {
	// @ts-expect-error
	use = React.experimental_use
}
else {
	use = compatible_use
}

export { use }
