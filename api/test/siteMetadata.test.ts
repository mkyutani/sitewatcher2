import { assertEquals } from "../deps_test.ts";
import { IdNames, createTestDirectories, createTestSites, deleteTestDirectories, deleteTestSites, getTestUrlBase } from "../util_test.ts";

Deno.test("Site metadata", async (t) => {
  const urlBase = getTestUrlBase();

  const directories: IdNames = await createTestDirectories();
  const sites: IdNames = await createTestSites(directories);

  await t.step("200: Create a site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Create a duplicated site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Create a site metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a site metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00invalid-uuid/metadata?key=type&value=list`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a site metadata without value", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata?key=type`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a site metadata without key", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
      method: "POST"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("200: Get a site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata?key=type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Get a site metadata with unregistered key", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata?key=unregistered`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 0);
    console.log(json);
  });

  await t.step("200: Get a site metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000/metadata?key=type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 0);
    console.log(json);
  });

  await t.step("400: Get a site metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/invalid-uuid/metadata?key=type`);
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("200: Get all site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("204: Delete a site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata?key=type`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete all site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await deleteTestSites();
  await deleteTestDirectories();  
});