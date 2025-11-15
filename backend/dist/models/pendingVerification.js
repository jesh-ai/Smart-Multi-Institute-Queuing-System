let pending = [];
export default {
    add(client) {
        pending.push(client);
    },
    list() {
        return pending;
    },
    clear() {
        pending = [];
    }
};
