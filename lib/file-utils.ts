/**
 * Sanitizes a filename by removing special characters and spaces.
 */
export function sanitizeFileName(name: string): string {
  return name
    .normalize('NFD') // Split accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w.-]+/g, ''); // Remove all non-word chars except dot and dash
}

/**
 * Attempts to remove metadata from an image File by redrawing it on a Canvas.
 * This effectively strips EXIF, IPTC, and XMP data.
 * Returns a new File object.
 */
export async function removeImageMetadata(file: File): Promise<File> {
  // Only process images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // For non-bitmap images (like SVG), we can't use canvas easy way without rasterizing.
  // Let's stick to common formats.
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return file;
  }

  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // Fallback if canvas fails
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        if (!blob) {
          resolve(file); // Fallback
          return;
        }

        const newFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        resolve(newFile);
      }, file.type);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // Return original on error
    };

    img.src = url;
  });
}
