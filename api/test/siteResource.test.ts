import { assertEquals } from "../deps_test.ts";
import { IdNames, createTestDirectories, createTestSites, deleteTestDirectories, deleteTestSites, getTestUrlBase } from "../util_test.ts";

Deno.test("Site resources", async (t) => {
  const urlBase = getTestUrlBase();

  const directories: IdNames = await createTestDirectories();
  const sites: IdNames = await createTestSites(directories);

  await t.step("200: Create site resources", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/resources`, {
      method: "POST",
      body: JSON.stringify({
        uri: "http://resource.xenopus.com",
        name: "Xenopus Resource",
        sections: ["section1", "section2", null, null, null, null],
        reason: "new"
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

  await t.step("200: Create site resources (initial)", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/resources?initial`, {
      method: "POST",
      body: JSON.stringify({
        uri: "http://resource2.xenopus.com",
        name: "Xenopus Resource 2",
        sections: [null, null, null, null, "section5", "section6"],
        reason: "new"
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

  await t.step("400: Create site resources with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000/resources`, {
      method: "POST",
      body: JSON.stringify({
        uri: "http://resource.xenopus.com",
        name: "Xenopus Resource",
        reason: "new"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create site resources with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00invalid-uuid/resources`, {
      method: "POST",
      body: JSON.stringify({
        uri: "http://resource.xenopus.com",
        name: "Xenopus Resource",
        reason: "new"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("415: Create a site resources with a plain text", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/resources`, {
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

  await t.step("400: Create a site resources with no content", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
    console.log(text)
  });

  await t.step("400: Create a site resources with null content", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/resources`, {
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

  await t.step("200: Get all site resources", async () => {
    const res = await fetch(`${urlBase}/sites/${sites["xenopus"]}/resources`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
    console.log(json);
  });

  await deleteTestSites();
  await deleteTestDirectories();  
});