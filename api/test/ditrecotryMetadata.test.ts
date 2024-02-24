import { assertEquals } from "../deps_test.ts";
import { IdNames, createTestDirectories, deleteTestDirectories, getTestUrlBase } from "../util_test.ts";

Deno.test("Directory metadata", async (t) => {
  const urlBase = getTestUrlBase();

  const directories: IdNames = await createTestDirectories();

  await t.step("200: Create a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Create a duplicated directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Create a directory metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a directory metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00invalid-uuid/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a directory metadata without value", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata?key=type`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a directory metadata without key", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("200: Get a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata?key=type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.key, "type");
    assertEquals(json.value, "list");
    console.log(json);
  });

  await t.step("200: Get a directory metadata with unregistered key", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata?key=unregistered`);
    const text = await res.text();
    assertEquals(res.status, 204);
  });

  await t.step("200: Get a directory metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000/metadata?key=type`);
    const text = await res.text();
    assertEquals(res.status, 204);
  });

  await t.step("400: Get a directory metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/invalid-uuid/metadata?key=type`);
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

  await t.step("204: Delete a directory metadata", async () => {
    const res = await fetch(`${urlBase}/directories/${directories["zebra"]}/metadata?key=type`, {
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

  await deleteTestDirectories();  
});