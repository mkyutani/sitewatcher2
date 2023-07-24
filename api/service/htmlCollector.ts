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
import { ResourceParam } from "../model/resources.ts";

export async function collectHtml(source: string): Promise<ResourceParam[]> {
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

    const resources: ResourceParam[] = [];

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
            let uri: string;
            if (href.match(/^[^:]*:/)) {
              uri = href;
            } else if (href.match(/^\/\//)) {
              uri = sourceUrlBase.protocol + href;
            } else if (href.match(/^\//)) {
              uri = urlJoin(sourceUrlBase.origin, href);
            } else {
              uri = urlJoin(sourceUrlBase.origin, sourceUrlDir, href);
            }
            if (uri.startsWith(sourceUrlBase.origin)) {
              resources.push({
                name: name,
                longName: name,
                uri: uri
              })
            }
          }
        }
      });

    log.info(`collectHtml:${resources.length} links found in ${source}`);
    return resources;
  } catch (reason) {
    log.error(`collectHtml:${reason.message}`);
    return reason;
  }
}