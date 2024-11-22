export default function closeGlobalSocet(globalSocket) {
    if (globalSocket && globalSocket.readyState === WebSocket.CLOSED) {
        return
    }

    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
        globalSocket.close(1000, 'Navigating to accounts page');
    }
}