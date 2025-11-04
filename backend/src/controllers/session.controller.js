import { scanNetwork } from "../routes/devices.routes.js";



export async function startScan() {
    while (true) {
        await scanNetwork();
    }
}