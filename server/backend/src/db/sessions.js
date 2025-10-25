

const results = new Map(); 

export function fetchSessions() {
    return results
}
export function storeSession(sessionID, session) {
    results.set(sessionID, session)
}