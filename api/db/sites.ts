import sql from "./db.ts"
import { log } from "../deps.ts";
import { collectHtml } from "../htmlCollector.ts";

type SiteParam = {
  name: string,
  source: string,
  type: string
};

async function getSite(id: string) {
  const site = await sql `
    select
      id, name, source, type
    from sites
    where id = ${parseInt(id, 10)}
  `
  return site[0];
}

async function getSites() {
  const sites = await sql `
    select
      id, name, source, type, lastUpdated
    from sites
  `
  return sites;
}

async function getSiteLinks(id: string) {
  const siteLinks = await sql `
    select
      id, site, name, longName, link, lastUpdated
    from siteLinks
    where site = ${parseInt(id, 10)}
  `
  return siteLinks;
}

async function createSite({...reqBody}: SiteParam) {
  try {
    const site = await sql `
      insert
      into sites (name, source, type, lastUpdated)
      values (${reqBody.name}, ${reqBody.source}, ${reqBody.type}, current_timestamp)
    `
    return site;
  } catch (error) {
    if (error instanceof sql.PostgresError) {
      log.error(`${error.name}:${error.code}:${error.detail}`);
      const pgErrorCode = parseInt(error.code);
      let errorCode = "UNRECOGNIZED";
      let errorMessage = "unrecognized error";
      if (pgErrorCode == 23505) {
        errorCode = "DUPLICATE"
        errorMessage = "already exists";
      }
      return {
        "errors": [
          {
            "code": errorCode,
            "message": errorMessage
          }
        ]
      }
    }
  }
}

async function updateSite(id: string, {...reqBody}: SiteParam) {
  try {
    const site = await sql `
      update sites
      set name = ${reqBody.name},
        source = ${reqBody.source},
        type = ${reqBody.type},
        lastUpdated = current_timestamp
      where id = ${parseInt(id, 10)}
    `
      return site;
  } catch (error) {
    if (error instanceof sql.PostgresError) {
      log.error(`${error.name}:${error.code}:${error.detail}`);
      const pgErrorCode = parseInt(error.code);
      let errorCode = "UNRECOGNIZED";
      let errorMessage = "unrecognized error";
      if (pgErrorCode == 23505) {
        errorCode = "DUPLICATE"
        errorMessage = "already exists";
      }
      return {
        "errors": [
          {
            "code": errorCode,
            "message": errorMessage
          }
        ]
      }
    }
  }
}

async function updateSiteLinks(id: string) {
  const links = await getSite(id)
    .then((site) => {
      const sourceType = site["type"].toLowerCase();
      const source = site["source"]
      if (sourceType == "html") {
        return collectHtml(source);
      }
    })
    .catch(() => {
      const errorCode = "UNRECOGNIZED";
      const errorMessage = "unrecognized error";
      return {
        "errors": [
          {
            "code": errorCode,
            "message": errorMessage
          }
        ]
      }
    })
  return links;
}

async function deleteSite(id: string) {
  const site = await sql `
    delete
    from sites
    where id = ${parseInt(id, 10)}
  `
  return site;
}

export { getSite, getSites, getSiteLinks, createSite, updateSite, updateSiteLinks, deleteSite };
export type { SiteParam };
