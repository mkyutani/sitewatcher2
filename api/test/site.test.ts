import { assertEquals } from "../deps_test.ts";
import { IdNames, createTestDirectories, deleteTestDirectories, getTestUrlBase } from "../util_test.ts";

Deno.test("Site", async (t) => {
  const urlBase = getTestUrlBase();
  const directories: IdNames = await createTestDirectories();
  const sites: string[] = [];

  await t.step("200: Create a site", async () => {
    const registrations = [
      {
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      },
      {
        name: "beaver",
        uri: "http://beaver.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      },
      {
        name: "alpaca-dead",
        uri: "http://alpaca-dead.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: false
      },
      {
        name: "alpaca-child",
        uri: "http://alpaca-child.com",
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
      if (text && text.length > 0) {
        console.log(`${res.status} ${text}`);
      }
      statuses.push(res.status);
      if (res.status === 200) {
        sites.push(JSON.parse(text).id);
      }
    }
    assertEquals(statuses.filter(function(n) { return n != 200; }).length, 0);
  });

  await t.step("415: Create a site with a plain text", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: "plain text",
      headers: {
        "Content-Type": "text/plain",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 415);
  });
  
  await t.step("400: Create a site with no content", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Create a site with null content", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: null,
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a site without name", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a site without directory", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a site with invalid directory uuid", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: "invalid-uuid",
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Create a site with unregistered directory uuid", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca9999",
        uri: "http://alpaca9999.com",
        directory: "00000000-0000-0000-0000-000000000000",
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a site without uri", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a site without enabled flag", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {}
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Create a site with invalid enabled flag", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: "ambiguous"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Create a duplicated site", async () => {
    const res = await fetch(`${urlBase}/sites`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("200: Get a site", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
    assertEquals(JSON.parse(text).id, id);
  });

  await t.step("200: Get a site with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 404);
  });

  await t.step("400: Get a site with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/invalid-uuid`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("200: Get all sites", async () => {
    const res = await fetch(`${urlBase}/sites`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
    assertEquals(JSON.parse(text).length, 3);
  });

  await t.step("200: Get all sites with name", async () => {
    const res = await fetch(`${urlBase}/sites?name=alpaca`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    const json = JSON.parse(text);
    assertEquals(res.status, 200);
    assertEquals(json.length, 2);
  });

  await t.step("200: Get all sites with strict flag", async () => {
    const res = await fetch(`${urlBase}/sites?strict=true&name=alpaca`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    const json = JSON.parse(text);
    assertEquals(res.status, 200);
    assertEquals(json.length, 1);
  });

  await t.step("200: Get all sites with name and all flag", async () => {
    const res = await fetch(`${urlBase}/sites?name=alpaca&all`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    const json = JSON.parse(text);
    assertEquals(res.status, 200);
    assertEquals(json.length, 3);
  });

  await t.step("200: Get all sites with directory id", async () => {
    const res = await fetch(`${urlBase}/sites?directory=${directories["zebra"]}`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    const json = JSON.parse(text);
    assertEquals(res.status, 200);
    assertEquals(json.length, 3);
  });

  await t.step("200: Get all site with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites?directory=00000000-0000-0000-0000-000000000000`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
  });

  await t.step("400: Get all site with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites?directory=invalid-uuid`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  Deno.test("200: Update a site", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca2",
        uri: "http://alpaca2.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
  });

  await t.step("415: Update a site with a plain text", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: "plain text",
      headers: {
        "Content-Type": "text/plain",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 415);
  });
  
  await t.step("400: Update a site with no content", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Update a site with null content", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: null,
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Update a site without name", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
  });

  await t.step("400: Update a site without directory", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
  });

  await t.step("400: Update a site with invalid directory uuid", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: "invalid-uuid",
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Update a site with unregistered directory uuid", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca9999",
        uri: "http://alpaca9999.com",
        directory: "00000000-0000-0000-0000-000000000000",
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("400: Update a site without uri", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
  });

  await t.step("400: Update a site without enabled flag", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {}
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 200);
  });
  
  await t.step("400: Update a site with invalid enabled flag", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: "ambiguous"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Update a duplicated site", async () => {
    const id = sites[0];
    const res = await fetch(`${urlBase}/sites/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca",
        uri: "http://alpaca-child.com",
        directory: directories["zebra"],
        metadata: {},
        enabled: true
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
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
      console.log(`${res.status} ${text}`);
    }
    assertEquals(statuses.filter(function(n) { return n != 204; }).length, 0);
  });

  await t.step("400: Delete a site with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/sites/invalid-uuid`, {
      method: "DELETE"
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("404: Delete a site with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/sites/00000000-0000-0000-0000-000000000000`, {
      method: "DELETE"
    }); 
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 404);
  });

  await deleteTestDirectories();  
});