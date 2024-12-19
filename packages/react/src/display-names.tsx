export function setDisplayNames (record: Record <string, any>) {
	for (const [ key, value ] of Object.entries (record)) {
		if (!value) continue
		if (typeof value === "function" || typeof value === "object") {
			value.displayName = key
		}
	}
}
