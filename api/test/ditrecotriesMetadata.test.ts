import { assertEquals } from "../deps_test.ts";

Deno.test("Directory metadata", async (t) => {
  const port = Number(Deno.env.get("API_PORT")) || 8089;
  const urlBase = `http://localhost:${port}/api/v1`;

  interface Directories {
    [name: string]: string;
  };
  const directories: Directories = {};

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
      return false;
    } else {
      directories[name as keyof Directories] = id;
      return true;
    }
  }

  async function createDirectory() {
    if (!await createADirectory("zebra", true) || !await createADirectory("yak", true) || !await createADirectory("yak2", true)) {
      console.log("Failed to create directories");
    }
  }

  async function deleteADirectory(id: string): Promise<void> {
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "DELETE"
    });
    if (res.status !== 204) {
      console.log("Failed to delete a directory");
    }
  }

  async function deleteDirectory() {
    for (const name of Object.keys(directories)) {
      await deleteADirectory(directories[name as keyof Directories]);
    }
  }

  await createDirectory();
  console.log(`Created directories: ${directories}`);

  await t.step("200: Create directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
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

  await t.step("200: Create directory metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000/metadata`, {
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
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create directory metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00invalid-uuid/metadata`, {
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
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("415: Create a directory metadata with a plain text", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "POST",
      body: "plain text",
      headers: {
        "Content-Type": "text/plain",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 415);
    console.log(text)
  });

  await t.step("400: Create a directory metadata with no content", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a directory metadata with null content", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "POST",
      body: null,
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("200: Get a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.value, "list");
    console.log(json);
  });

  await t.step("200: Get a directory metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    console.log(text)
  });

  await t.step("400: Get a directory metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/invalid-uuid/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("200: Get all directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Update directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
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

  await t.step("200: Update directory metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000/metadata`, {
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
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Update directory metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00invalid-uuid/metadata`, {
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
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("415: Update a directory metadata with a plain text", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "PUT",
      body: "plain text",
      headers: {
        "Content-Type": "text/plain",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 415);
    console.log(text)
  });

  await t.step("400: Update a directory metadata with no content", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });
  
  await t.step("400: Update a directory metadata with null content", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "PUT",
      body: null,
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("204: Delete a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata/type`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete all directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
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
    assertEquals(json.length, Object.keys(directories).length);
    console.log(json);
  });

  await t.step("200: Create directory metadata for directories by name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata?name=yak`, {
      method: "POST",
      body: JSON.stringify({
        condition: "sleeping"
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

  await t.step("200: Create directory metadata for directories by strict name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata?name=yak&strict=true`, {
      method: "POST",
      body: JSON.stringify({
        history: "new"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 1);
    console.log(json);
  });

  await t.step("200: Get a directory metadata for all directories", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/lock`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, Object.keys(directories).length);
    console.log(json);
  });

  await t.step("200: Get a directory metadata for directories by name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/condition?name=yak`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Get a directory metadata for directories by strict name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/history?name=yak&strict=true`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 1);
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
    assertEquals(json.length, Object.keys(directories).length);
    console.log(json);
  });

  await t.step("200: Update directory metadata for directories by name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata?name=yak`, {
      method: "PUT",
      body: JSON.stringify({
        condition: "awake"
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

  await t.step("200: Update directory metadata for directories by strict name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata?name=yak&strict=true`, {
      method: "PUT",
      body: JSON.stringify({
        history: ""
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 1);
    console.log(json);
  });

  await t.step("204: Delete a directory metadata for all directories", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/lock`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete a directory metadata for directories by name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/condition?name=yak`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete a directory metadata for directories by strict name", async () => {
    const res = await fetch(`${urlBase}/directories/metadata/history?name=yak&strict=true`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await deleteDirectory();  
  console.log(`Deleted directories`);
});