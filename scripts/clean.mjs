// Simple cross-platform clean script
import { rm, stat } from 'node:fs/promises';

async function main() {
  try {
    await stat('dist');
    await rm('dist', { recursive: true, force: true });
    console.log('[clean] Removed dist directory');
  } catch (e) {
    console.log('[clean] dist directory not present, skipping');
  }
}

main();
