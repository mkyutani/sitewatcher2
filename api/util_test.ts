export interface IdNames {
  [name: string]: string;
};
const directories: IdNames = {};
const sites: IdNames = {};

const port: number = Number(Deno.env.get("API_PORT")) || 8089;
const urlBase: string = `http://localhost:${port}/api/v1`;

export function getTestUrlBase(): string {
  return urlBase;
}

async function createADirectory(name: string, enabled: boolean): Promise<boolean> {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    body: JSON.stringify({
      name: name,
      enabled: enabled
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  if (res.status !== 200) {
    console.log(`Failed to create directory: ${name}`);
    return false;
  } else {
    const id = JSON.parse(text).id;
    directories[name as keyof IdNames] = id;
    console.log(`Directory created: ${name}`);
    return true;
  }
}

export async function createTestDirectories(): Promise<IdNames> {
  await createADirectory("zebra", true);
  await createADirectory("yak", true);
  await createADirectory("yak2", true);
  return directories;
}

async function deleteADirectory(name: string, id: string): Promise<void> {
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "DELETE"
  });
  const text = await res.text();
  if (res.status !== 204) {
    console.log(`Failed to delete a directory: ${name}`);
  } else {
    console.log(`Directory deleted: ${name}`);
  }
}

export async function deleteTestDirectories(): Promise<void> {
  for (const name of Object.keys(directories)) {
    await deleteADirectory(name, directories[name as keyof IdNames]);
  }
}

async function createASite(name: string, uri: string, directory: string, enabled: boolean): Promise<boolean> {
  const res = await fetch(`${urlBase}/sites`, {
    method: "POST",
    body: JSON.stringify({
      name: name,
      uri: uri,
      directory: directory,
      enabled: enabled
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  if (res.status !== 200) {
    console.log(`Failed to create site: ${name}`);
    return false;
  } else {
    const id = JSON.parse(text).id;
    sites[name as keyof IdNames] = id;
    console.log(`Site created: ${name}`);
    return true;
  }
}

export async function createTestSites(directories: IdNames): Promise<IdNames> {
  await createASite("xenopus", "http://xenopus.com/", directories["zebra"], true);
  await createASite("whale", "http://whale.com/", directories["zebra"], true);
  await createASite("whale2", "http://whale2.com/", directories["zebra"], true);
  return sites;
}

async function deleteASite(name: string, id: string): Promise<void> {
  const res = await fetch(`${urlBase}/sites/${id}`, {
    method: "DELETE"
  });
  const text = await res.text();
  if (res.status !== 204) {
    console.log(`Failed to delete a site: ${name}`);
  } else {
    console.log(`Site deleted: ${name}`);
  }
}

export async function deleteTestSites(): Promise<void> {
  for (const name of Object.keys(sites)) {
    await deleteASite(name, sites[name as keyof IdNames]);
  }
}