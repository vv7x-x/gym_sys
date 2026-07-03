let html5QrCode = null;

export async function startScanner(elementId, onResult) {
    html5QrCode = new Html5Qrcode(elementId);
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        onResult,
        () => {}
    );

    return html5QrCode;
}

export function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
        html5QrCode = null;
    }
}

export function handleScanResult(decodedText) {
    stopScanner();
    const uuid = decodedText.trim();
    if (uuid && uuid.length === 36) {
        window.location.href = `member.html?id=${uuid}`;
    } else {
        document.getElementById('scanResult').innerHTML = `
            <div class="toast toast-error">
                <i class="fas fa-exclamation-circle"></i>
                Invalid QR code. Expected a member UUID.
            </div>`;
        setTimeout(() => { window.location.reload(); }, 2000);
    }
}
