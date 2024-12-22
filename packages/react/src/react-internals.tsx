import _React from "react"
const React = _React as any

export interface Dispatcher {
	readContext: <C extends React.Context<any>> (context: C) => React.ContextType<C>
}

export function isRSC () {
	return !!React.__SERVER_INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
}

export function resolveDispatcher() {
	const clientInternals = React.__CLIENT_INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
	if (clientInternals) return clientInternals.H

	const legacyInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
	if (legacyInternals) return legacyInternals.ReactCurrentDispatcher.current

	throw new Error ("React internals not found")
}
