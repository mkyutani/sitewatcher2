import sql from "./db.ts"
import { log } from "../deps.ts";

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
  return site;
}

async function getSites() {
  const sites = await sql `
    select
      id, name, source, type
    from sites
  `
  return sites;
}

async function createSite({...reqBody}: SiteParam) {
  try {
    const site = await sql `
      insert
      into sites (name, source, type)
      values (${reqBody.name}, ${reqBody.source}, ${reqBody.type})
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
      set ${sql(reqBody, "name", "source", "type")}
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

async function deleteSite(id: string) {
  const site = await sql `
    delete
    from sites
    where id = ${parseInt(id, 10)}
  `
  return site;
}

export { getSite, getSites, createSite, updateSite, deleteSite };
export type { SiteParam };
