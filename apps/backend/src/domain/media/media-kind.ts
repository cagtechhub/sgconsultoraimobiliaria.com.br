export type MediaKind = "IMAGE" | "VIDEO" | "DOCUMENT"

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
])

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
])

const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
])

export const ALLOWED_MEDIA_MIME_TYPES = new Set([
  ...IMAGE_TYPES,
  ...VIDEO_TYPES,
  ...DOCUMENT_TYPES,
])

export const resolveMediaKind = (mimeType: string, fileName: string): MediaKind | null => {
  const lowerName = fileName.toLowerCase()
  if (IMAGE_TYPES.has(mimeType) || mimeType.startsWith("image/")) return "IMAGE"
  if (VIDEO_TYPES.has(mimeType) || mimeType.startsWith("video/")) return "VIDEO"
  if (
    DOCUMENT_TYPES.has(mimeType) ||
    lowerName.endsWith(".pdf") ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".doc")
  ) {
    return "DOCUMENT"
  }
  return null
}
