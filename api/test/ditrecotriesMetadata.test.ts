import { assertEquals, fail } from "../deps_test.ts";

Deno.test("Directory metadata", async (t) => {
  const port = Number(Deno.env.get("API_PORT")) || 8089;
  const urlBase = `http://localhost:${port}/api/v1`;

  async function createDirectory(): Promise<string | null> {
    const res = await fetch(`${urlBase}/directories`, {
      method: "POST",
      body: JSON.stringify({
        name: "zebra",
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    if (res.status !== 200) {
      console.log("Failed to create a directory");
      return null;
    } else {
      return JSON.parse(text).id;
    }
  }

  async function deleteDirectory(id: string | null): Promise<void> {
    if (id) {
      const res = await fetch(`${urlBase}/directories/${id}`, {
        method: "DELETE"
      });
      if (res.status !== 204) {
        console.log("Failed to delete a directory");
      }
    }
  }

  const directory = await createDirectory();

  await t.step("200: Create directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directory}/metadata`, {
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
    console.log(json);
  });

  await t.step("200: Get a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directory}/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.value, "list");
    console.log(json);
  });

  await t.step("200: Get all directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directory}/metadata`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Update directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directory}/metadata`, {
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
    console.log(json);
  });

  await t.step("204: Delete a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directory}/metadata?type`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete all directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directory}/metadata`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await deleteDirectory(directory);  
});