import { assertEquals, fail } from "../deps_test.ts";

const port = Number(Deno.env.get("API_PORT")) || 8089;
const urlBase = `http://localhost:${port}/api/v1`;

const directories: string[] = [];

Deno.test("200: Create a directory", async () => {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    body: JSON.stringify({
      name: "内閣官房",
      enabled: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  assertEquals(res.status, 200);
  directories.push(JSON.parse(text).id);
});

Deno.test("200: Get a directory", async () => {
  if (directories.length === 0) {
    fail();
  } else {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`);
    const text = await res.text();
    assertEquals(res.status, 200);
    assertEquals(JSON.parse(text).id, id);
  }
});

Deno.test("204: Delete a directory", async () => {
  if (directories.length === 0) {
    fail();
  } else {
    const id = directories[0];
    for (const id of directories) {
      const res = await fetch(`${urlBase}/directories/${id}`, {
        method: "DELETE"
      });
      assertEquals(res.status, 204);
    }
  }
});