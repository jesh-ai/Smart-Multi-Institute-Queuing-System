

const results = new Map(); 

export function fetchSessions() {
    return results
}
export function storeSession(mac, session) {
    results.set(mac, session)
}