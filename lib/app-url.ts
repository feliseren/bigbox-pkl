export function toAppUrl(path: string, requestUrl?: string) {
  const baseUrl = process.env.APP_URL?.trim();
  if (baseUrl) {
    return new URL(path, baseUrl);
  }

  return new URL(path, requestUrl);
}
