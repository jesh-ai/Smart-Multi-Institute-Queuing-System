const counters = new Map();
function createCounter(id) {
    if (!counters.has(id)) {
        counters.set(id, { id, status: 'vacant', currentEntry: null });
    }
    return counters.get(id);
}
function assignEntryToCounter(counterId, entry) {
    const c = createCounter(counterId);
    if (c.status === 'busy') {
        throw new Error('Counter is already busy');
    }
    c.status = 'busy';
    c.currentEntry = {
        entryId: entry.entryId,
        formEntries: entry.formEntries || {},
        assignedAt: new Date().toISOString()
    };
    return c;
}
function completeTransaction(counterId) {
    const c = createCounter(counterId);
    if (c.status === 'vacant') {
        throw new Error('Counter is already vacant');
    }
    c.status = 'vacant';
    const finished = c.currentEntry;
    c.currentEntry = null;
    return { counter: c, finished };
}
function getCounter(id) {
    return counters.get(id) || null;
}
function listCounters() {
    return Array.from(counters.values());
}
export {};
