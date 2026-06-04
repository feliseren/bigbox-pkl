import path from "path";
import { mkdir, writeFile } from "fs/promises";

type UploadKind = "image" | "pdf";

const extensionByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

function getAllowedExtension(file: File, kind: UploadKind) {
  const originalName = file.name || "file";
  const extFromName = path.extname(originalName).toLowerCase();
  const extFromMime = extensionByMime[file.type || ""];
  const ext = extFromName && extFromName !== ".bin" ? extFromName : extFromMime;
  const allowed =
    kind === "image"
      ? new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])
      : new Set([".pdf"]);

  if (!ext || !allowed.has(ext)) {
    throw new Error(`Unsupported ${kind} upload type`);
  }

  return ext === ".jpeg" ? ".jpg" : ext;
}

export async function saveUpload(
  file: File | null,
  folder: string,
  kind: UploadKind,
) {
  if (!file || !file.size) return null;

  const ext = getAllowedExtension(file, kind);
  const safeBase = path
    .basename(file.name || "file", path.extname(file.name || "file"))
    .replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${safeBase || kind}-${Date.now()}-${Math.floor(
    Math.random() * 10000,
  )}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  if (!fileBuffer.length) {
    throw new Error("Uploaded file is empty");
  }

  await writeFile(path.join(uploadDir, filename), fileBuffer);
  return `/uploads/${folder}/${filename}`;
}

