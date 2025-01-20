"use client"

import "@/lib/feed/the-feed"
import "@/lib/post/the-post"

import { theFeedLoader } from "@/lib/feed/the-feed"
import { Provider, RootProvider } from "@reconjs/react"
import { createContext, ReactNode, useCallback, useContext } from "react"
import { BskyFeed } from "@/lib/feed/types"

export const FeedIdContext = createContext <string|null>(null)

export function FeedProvider (props: {
	children: ReactNode,
	feed: Promise <BskyFeed>,
}) {
	const feedId = useContext (FeedIdContext)
	const loadFeed = useCallback (() => {
		console.log (feedId)
		return props.feed
	}, [props.feed])

	return (
		<Provider context={theFeedLoader} value={loadFeed}>
			{props.children}
		</Provider>
	)
}

export function Client (props: {
	children: ReactNode,
}) {
	return (
		<RootProvider>
			{props.children}
		</RootProvider>
	)
}
