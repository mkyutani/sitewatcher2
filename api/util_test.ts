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

export async function createADirectory(name: string, enabled: boolean): Promise<string | null> {
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
    return null;
  } else {
    const id = JSON.parse(text).id;
    console.log(`Directory created: ${id} ${name}`);
    return id;
  }
}

export async function createTestDirectories(): Promise<IdNames> {
  const id1 = await createADirectory("zebra", true);
  if (id1)
    directories["zebra"] = id1;
  const id2 = await createADirectory("yak", true);
  if (id2)
    directories["yak"] = id2;
  const id3 = await createADirectory("yak2", true);
  if (id3)
    directories["yak2"] = id3;
  return directories;
}

export async function deleteADirectory(id: string): Promise<void> {
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "DELETE"
  });
  const text = await res.text();
  if (res.status !== 204) {
    console.log(`Failed to delete a directory: ${id}`);
  } else {
    console.log(`Directory deleted: ${id}`);
  }
}

export async function deleteTestDirectories(): Promise<void> {
  for (const name of Object.keys(directories)) {
    await deleteADirectory(directories[name as keyof IdNames]);
  }
}

export async function createASite(name: string, uri: string, directory: string, enabled: boolean): Promise<string | null> {
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
    return null;
  } else {
    const id = JSON.parse(text).id;
    console.log(`Site created: ${id} ${name}`);
    return id;
  }
}

export async function createTestSites(directories: IdNames): Promise<IdNames> {
  const id1 = await createASite("xenopus", "http://xenopus.com/", directories["zebra"], true);
  if (id1)
    sites["xenopus"] = id1;
  const id2 = await createASite("whale", "http://whale.com/", directories["zebra"], true);
  if (id2)
    sites["whale"] = id2;
  const id3 = await createASite("whale2", "http://whale2.com/", directories["zebra"], true);
  if (id3)
    sites["whale2"] = id3;
  return sites;
}

export async function deleteASite(id: string): Promise<void> {
  const res = await fetch(`${urlBase}/sites/${id}`, {
    method: "DELETE"
  });
  const text = await res.text();
  if (res.status !== 204) {
    console.log(`Failed to delete a site: ${id}`);
  } else {
    console.log(`Site deleted: ${id}`);
  }
}

export async function deleteTestSites(): Promise<void> {
  for (const name of Object.keys(sites)) {
    await deleteASite(sites[name as keyof IdNames]);
  }
}