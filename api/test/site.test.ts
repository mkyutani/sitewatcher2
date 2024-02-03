import { assertEquals } from "../deps_test.ts";
import { TestDirectories, createTestDirectories, deleteTestDirectories, getTestUrlBase } from "../util_test.ts";

Deno.test("Site", async (t) => {
  const urlBase = getTestUrlBase();
  const directories: TestDirectories = await createTestDirectories();
  const sites: string[] = [];

  await t.step("200: Create a site", async () => {
    const registrations = [
      {
        name: "almadillo",
        uri: "http://almadillo.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      },
      {
        name: "beatle",
        uri: "http://beatle.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      },
      {
        name: "almadillo-child",
        uri: "http://almadillo-child.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }
    ];
    const statuses: number[] = [];
    for (const data of registrations) {
      const res = await fetch(`${urlBase}/sites`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const text = await res.text();
      statuses.push(res.status);
      if (res.status === 200) {
        sites.push(JSON.parse(text).id);
      }
    }
    assertEquals(statuses.filter(function(n) { return n != 200; }).length, 0);
  });

  await t.step("204: Delete a site", async () => {
    const statuses: number[] = [];
    while (sites.length > 0) {
      const id = sites.pop();
      const res = await fetch(`${urlBase}/sites/${id}`, {
        method: "DELETE"
      });
      const text = await res.text();
      statuses.push(res.status);
    }
    assertEquals(statuses.filter(function(n) { return n != 204; }).length, 0);
  });
  
  await t.step("400: Delete a site with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/invalid-uuid`, {
      method: "DELETE"
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });
  
  await t.step("404: Delete a site with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000`, {
      method: "DELETE"
    }); 
    const text = await res.text();
    assertEquals(res.status, 404);
  });

  await deleteTestDirectories();  
});