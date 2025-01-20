/// <reference types="@atcute/bluesky/lexicons" />
import { XRPC, simpleFetchHandler } from '@atcute/client'

function once <T> (fn: () => T) {
	let result: T | undefined

	return () => {
		if (result) return result
		return result = fn()
	}
}

const init = once (async () => {
	const service = 'https://api.bsky.app'
	const handler = simpleFetchHandler ({ service })
	const rpc = new XRPC ({ handler })

	return rpc
})

type BskyXRPC = Awaited <ReturnType<typeof init>>
type BskyQuery = BskyXRPC['get']

export const atproto: BskyQuery = async (...args) => {
	const rpc = await init()
	return await rpc.get (...args)
}
