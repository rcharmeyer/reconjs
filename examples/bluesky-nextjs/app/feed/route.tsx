
import { NextResponse } from "next/server"
import { atproto } from "../atproto.server"
import { BskyFeed } from "@/lib/feed/types"

async function fetchFeed(): Promise<BskyFeed> {
	"use server"
	const { data } = await atproto ("app.bsky.feed.getAuthorFeed", {
		params: {
			actor: "did:plc:uvuzsptk4b22b63xowm62chr",
			limit: 30,
		},
	})

	// close enough
	// @ts-expect-error
	return data
}

export async function GET() {
	return NextResponse.json (await fetchFeed())
}