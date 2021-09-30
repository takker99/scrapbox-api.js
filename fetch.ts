import { toURLSearchParams } from "./utils.ts";
import { HTTPError } from "./error.ts";
export type FetchLike = (
  ...args: Parameters<typeof globalThis.fetch>
) => ReturnType<typeof globalThis.fetch>;

type Options = {
  fetch?: FetchLike;
  sid?: string;
  params?: Record<string, string | string[]> | URLSearchParams;
};
const DOMAIN = "scrapbox.io";

export async function get(path: string, { fetch, sid, params }: Options) {
  const url = `https://${DOMAIN}${path}?${createQueryString(params)}`;
  const init = sid !== undefined
    ? {
      headers: { Cookie: `connect.sid=${sid}` },
    }
    : {};

  const res = await (fetch ?? globalThis.fetch)(url, init);
  if (!res.ok) {
    throw new HTTPError(res);
  }
  return res;
}

function createQueryString(
  params?: Record<string, string | string[]> | URLSearchParams,
) {
  return params === undefined
    ? ""
    : params instanceof URLSearchParams
    ? params.toString()
    : toURLSearchParams(params).toString();
}
