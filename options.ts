import { FetchLike } from "./types.ts";
export type Options = {
  sid?: string;
  fetch?: FetchLike;
};

export function createCookieHeaders(sid: string) {
  return {
    headers: { Cookie: `connect.sid=${sid}` },
  };
}
