import { assertEquals } from "../deps_test.ts";

Deno.test("Directory metadata", async (t) => {
  const port = Number(Deno.env.get("API_PORT")) || 8089;
  const urlBase = `http://localhost:${port}/api/v1`;

  const directories: string[] = [];

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

  async function createDirectory(): Promise<any> {
    const id1 = await requestToCreateDirectory("zebra", true);
    if (id1) {
      directories.push(id1);
    }

    const id2 = await requestToCreateDirectory("yak", true);
    if (id2) {
      directories.push(id2);
    }

    if (directories.length < 2) {
      console.log("Failed to create a directory");
    }
  }

  async function deleteDirectory(): Promise<void> {
    for (const id of directories) {
      const res = await fetch(`${urlBase}/directories/${id}`, {
        method: "DELETE"
      });
      if (res.status !== 204) {
        console.log("Failed to delete a directory");
      }
    }
  }

  await createDirectory();
  console.log(`Created directories: ${directories}`);

  await t.step("200: Create directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories[0]}/metadata`, {
      method: "POST",
      body: JSON.stringify({
        type: "list",
        state: "active"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Get a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories[0]}/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.value, "list");
    console.log(json);
  });

  await t.step("200: Get all directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories[0]}/metadata`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Update directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories[0]}/metadata`, {
      method: "PUT",
      body: JSON.stringify({
        type: "new",
        state: "inactive",
        expired: "true"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 3);
    console.log(json);
  });

  await t.step("204: Delete a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories[0]}/metadata/type`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete all directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories[0]}/metadata`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("200: Create directory metadata for all directories", async () => {
    const res = await fetch(`${urlBase}/directories/metadata`, {
      method: "POST",
      body: JSON.stringify({
        lock: "locked"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Get a directory metadata for all directories", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/lock`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Update directory metadata for all directories", async () => {
    const res = await fetch(`${urlBase}/directories/metadata`, {
      method: "PUT",
      body: JSON.stringify({
        lock: "unlocked"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("204: Delete a directory metadata for all directories", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/lock`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await deleteDirectory();  
  console.log(`Deleted directories`);
});