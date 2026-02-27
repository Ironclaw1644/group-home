import { dbGet } from '@/lib/storage';

export async function getPageBlockMap() {
  const blocks = await dbGet('pages');
  return new Map(blocks.map((b) => [b.key, b.value]));
}
