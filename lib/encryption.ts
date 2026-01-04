export async function encryptFile(
  file: File,
  keyString: string = 'gaivota-secret-key-2025'
): Promise<{ blob: Blob; originalName: string }> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(keyString.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('gaivota-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const buffer = await file.arrayBuffer();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    buffer
  );

  const combinedBuffer = new Uint8Array(iv.byteLength + encryptedContent.byteLength);
  combinedBuffer.set(iv);
  combinedBuffer.set(new Uint8Array(encryptedContent), iv.byteLength);

  return {
    blob: new Blob([combinedBuffer], { type: 'application/octet-stream' }),
    originalName: file.name,
  };
}

export async function decryptFile(
  blob: Blob,
  keyString: string = 'gaivota-secret-key-2025'
): Promise<Blob> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(keyString.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('gaivota-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const buffer = await blob.arrayBuffer();
  const iv = buffer.slice(0, 12);
  const data = buffer.slice(12);

  try {
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      key,
      data
    );

    return new Blob([decryptedContent]);
  } catch (e) {
    // console.error('Decryption failed', e); // Suppressed to allow fallback for unencrypted files
    throw e;
  }
}
