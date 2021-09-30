export function toURLSearchParams(params: Record<string, string | string[]>) {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => urlSearchParams.append(key, v));
    } else {
      urlSearchParams.append(key, value);
    }
  }
  return urlSearchParams;
}
