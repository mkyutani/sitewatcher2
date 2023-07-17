import {
  dirname,
  DOMParser,
  Element,
  HTMLDocument,
  log,
  Node,
  urlJoin,
  urlParse,
} from "../deps.ts";
import { LinkInfo } from "./linkInfo.ts";

export async function collectHtml(source: string): Promise<LinkInfo[]> {
  const sourceUrlBase = urlParse(source);
  const sourceUrlDir = source.endsWith("/")
    ? sourceUrlBase.pathname
    : dirname(sourceUrlBase.pathname);

  try {
    const res = await fetch(source);
    if (res.status >= 400) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const content_type = res.headers.get("Content-type");
    if (!content_type) {
      throw new Error("No content-type");
    }
    const mime_type = content_type.split(";")[0].trim().toLowerCase();
    if (mime_type !== "text/html") {
      throw new Error(`Unexpected mime type: ${content_type}`);
    }
    const charset = content_type.split(";")[1]?.split("=")[1]?.trim()
      .toLowerCase();
    if (!charset) {
      log.warning(`No charset: ${content_type}; assume utf-8`);
    } else if (charset !== "utf-8") {
      throw new Error(`Unexpected charset: ${content_type}`);
    }

    const text = await res.text();
    if (!text || text.length == 0) {
      throw new Error("No text");
    }

    const parser: DOMParser = new DOMParser();
    const document: HTMLDocument | null = parser.parseFromString(
      text,
      "text/html",
    );
    if (!document) {
      throw new Error("Failed to parse document");
    }

    const linkInfos: LinkInfo[] = [];

    Array.from(document.querySelectorAll("body a"))
      .filter((n: Node): n is Element => n instanceof Element)
      .filter((e: Element) => e.textContent?.length > 0)
      .forEach((e: Element) => {
        for (const a of e.attributes) {
          if (
            a.nodeName == "href" &&
            !/^#|tel:|mailto:|javascript:/i.test(a.value)
          ) {
            const name = e.textContent.trim();
            const href = a.value.trim().replace(/[\n\r]/g, "");
            let link: string;
            if (href.match(/^[^:]*:/)) {
              link = href;
            } else if (href.match(/^\/\//)) {
              link = sourceUrlBase.protocol + href;
            } else if (href.match(/^\//)) {
              link = urlJoin(sourceUrlBase.origin, href);
            } else {
              link = urlJoin(sourceUrlBase.origin, sourceUrlDir, href);
            }
            if (link.startsWith(sourceUrlBase.origin)) {
              linkInfos.push({
                name: name,
                longName: name,
                link: link
              })
            }
          }
        }
      });

    log.info(`collectHtml:${linkInfos.length} links found in ${source}`);
    return linkInfos;
  } catch (reason) {
    log.error(`collectHtml:${reason.message}`);
    return reason;
  }
}