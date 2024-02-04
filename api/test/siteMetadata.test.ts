import { assertEquals } from "../deps_test.ts";
import { IdNames, createTestDirectories, createTestSites, deleteTestDirectories, deleteTestSites, getTestUrlBase } from "../util_test.ts";

Deno.test("Site metadata", async (t) => {
  const urlBase = getTestUrlBase();

  const directories: IdNames = await createTestDirectories();
  const sites: IdNames = await createTestSites(directories);

  await t.step("200: Create site metadata", async () => {
    console.log(`${urlBase}/sites/${sites["xenopus"]}/metadata`);
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
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

  await t.step("200: Create site metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000/metadata`, {
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

  await t.step("400: Create site metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00invalid-uuid/metadata`, {
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

  await t.step("415: Create a site metadata with a plain text", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
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

  await t.step("400: Create a site metadata with no content", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a site metadata with null content", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
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

  await t.step("200: Get a site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.value, "list");
    console.log(json);
  });

  await t.step("200: Get a site metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000/metadata/type`);
    const text = await res.text();
    assertEquals(res.status, 200);
    console.log(text)
  });

  await t.step("400: Get a site metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/invalid-uuid/metadata/type`);
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

  await t.step("200: Update site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
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

  await t.step("200: Update site metadata with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000/metadata`, {
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

  await t.step("400: Update site metadata with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00invalid-uuid/metadata`, {
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

  await t.step("415: Update a site metadata with a plain text", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
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

  await t.step("400: Update a site metadata with no content", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });
  
  await t.step("400: Update a site metadata with null content", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata`, {
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

  await t.step("204: Delete a site metadata", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/metadata/type`, {
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

  await t.step("200: Create site metadata for all sites", async () => {
    const res = await fetch(`${urlBase}/sites/metadata`, {
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
    assertEquals(json.length, Object.keys(sites).length);
    console.log(json);
  });

  await t.step("200: Create site metadata for sites by name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata?name=whale`, {
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

  await t.step("200: Create site metadata for sites by strict name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata?name=whale&strict`, {
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

  await t.step("200: Get a site metadata for all sites", async () => {
    const res = await fetch(`${urlBase}/sites/metadata/lock`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, Object.keys(sites).length);
    console.log(json);
  });

  await t.step("200: Get a site metadata for sites by name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata/condition?name=whale`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await t.step("200: Get a site metadata for sites by strict name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata/history?name=whale&strict=true`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 1);
    console.log(json);
  });

  await t.step("200: Get all site metadata for all sites", async () => {
    const res = await fetch(`${urlBase}/sites/metadata`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 6);
    console.log(json);
  });

  await t.step("200: Get all site metadata for sites by name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata?name=whale`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 5);
    console.log(json);
  });

  await t.step("200: Get all site metadata for sites by strict name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata?name=whale&strict`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 3);
    console.log(json);
  });

  await t.step("200: Update site metadata for all sites", async () => {
    const res = await fetch(`${urlBase}/sites/metadata`, {
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
    assertEquals(json.length, Object.keys(sites).length);
    console.log(json);
  });

  await t.step("200: Update site metadata for sites by name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata?name=whale`, {
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

  await t.step("200: Update site metadata for sites by strict name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata?name=whale&strict=`, {
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

  await t.step("204: Delete a site metadata for all sites", async () => {
    const res = await fetch(`${urlBase}/sites/metadata/lock`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete a site metadata for sites by name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata/condition?name=whale`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await t.step("204: Delete a site metadata for sites by strict name", async () => {
    const res = await fetch(`${urlBase}/sites/metadata/history?name=whale&strict`, {
      method: "DELETE"
    });
    assertEquals(res.status, 204);
  });

  await deleteTestSites();
  await deleteTestDirectories();  
});