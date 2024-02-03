export interface TestDirectories {
  [name: string]: string;
};
const directories: TestDirectories = {};

const port: number = Number(Deno.env.get("API_PORT")) || 8089;
const urlBase: string = `http://localhost:${port}/api/v1`;

async function requestToCreateDirectory(name: string, enabled: boolean): Promise<string | null> {
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
    return null;
  } else {
    return JSON.parse(text).id;
  }
}

async function createADirectory(name: string, enabled: boolean): Promise<boolean> {
  const id = await requestToCreateDirectory(name, enabled);
  if (id === null) {
    console.log(`Failed to create directory: ${name}`);
    return false;
  } else {
    directories[name as keyof TestDirectories] = id;
    console.log(`Directory created: ${name}`);
    return true;
  }
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

export async function createTestDirectories(): Promise<TestDirectories> {
  if (!await createADirectory("zebra", true) || !await createADirectory("yak", true) || !await createADirectory("yak2", true)) {
  }
  return directories;
}

export async function deleteTestDirectories(): Promise<void> {
  for (const name of Object.keys(directories)) {
    await deleteADirectory(name, directories[name as keyof TestDirectories]);
  }
}

export function getTestUrlBase(): string {
  return urlBase;
}