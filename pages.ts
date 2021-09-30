import type {
  NotFoundError,
  NotMemberError,
  Page,
  PageListResponse,
} from "https://raw.githubusercontent.com/scrapbox-jp/types/0.0.2/scrapbox.d.ts";
import { isJSON } from "https://deno.land/x/is_json@v1.0.2/mod.ts";
import { createCookieHeaders, Options } from "./options.ts";
import { toLc } from "./lc.ts";

type PageProps = {
  project: string;
  title: string;
  followRename?: boolean;
} & Options;
type PageListProps = {
  project: string;
  limit?: number;
} & Options;

export const pages = {
  async get(
    { project, title, sid, fetch = globalThis.fetch, followRename = false }:
      PageProps,
  ) {
    const response = await fetch(
      `https://scrapbox.io/api/pages/${project}/${toLc(title)}${
        followRename ? `?followRename=true` : ""
      }`,
      sid !== undefined ? createCookieHeaders(sid) : undefined,
    );

    if (!response.ok) {
      const text = await response.text();
      if (!isJSON(text)) throw Error(response.statusText);

      const json = await response.json();
      switch (json.name) {
        case "NotMemberError":
          return json as NotMemberError;
        case "NotFoundError":
          return json as NotFoundError;
        default:
          throw Error(response.statusText);
      }
    }

    const json = (await response.json()) as Page;
    return json;
  },
  async list({ project, limit, sid, fetch }: PageListProps) {
    const firstResponse = await list({project,limit,sid,fetch});
    if (typeof firstResponse.message){

    }
  },
};

async function list(props: PageListProps & { skip?: number }) {
  const { project, limit = 1000, skip = 0, sid, fetch = globalThis.fetch } =
    props;
  const params = new URLSearchParams();
  params.append("skip", skip.toString());
  params.append("limit", (Math.min(limit, 1000)).toString());

  const response = await fetch(
    `https://scrapbox.io/api/pages/${project}?${params.toString()}`,
    sid !== undefined ? createCookieHeaders(sid) : undefined,
  );

  if (!response.ok) {
    const text = await response.text();
    if (!isJSON(text)) throw Error(response.statusText);

    const json = await response.json();
    switch (json.name) {
      case "NotMemberError":
        return json as NotMemberError;
      case "NotFoundError":
        return json as NotFoundError;
      default:
        throw Error(response.statusText);
    }
  }

  const json = (await response.json()) as PageListResponse;
  return json;
}
