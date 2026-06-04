import { existsSync } from "fs";
import path from "path";

const FALLBACK_STORY_IMAGE = "/bg-karyawan.jpeg";

export function resolveLocalImageUrl(value?: string | null) {
  if (!value) return FALLBACK_STORY_IMAGE;
  if (value.toLowerCase().endsWith(".bin")) return FALLBACK_STORY_IMAGE;
  if (!value.startsWith("/")) return value;

  const localPath = path.join(process.cwd(), "public", value);
  return existsSync(localPath) ? value : FALLBACK_STORY_IMAGE;
}
