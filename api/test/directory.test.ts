import { assertEquals, fail } from "../deps_test.ts";
import { createASite, deleteASite, getTestUrlBase } from "../util_test.ts";

Deno.test("Directory", async (t) => {
  const urlBase = getTestUrlBase();
  const directories: string[] = [];

  await t.step("200: Create a directory", async () => {
    const registrations = [
      {
        name: "alpaca"
      },
      {
        name: "beaver"
      },
      {
        name: "alpaca-child"
      }
    ];
    const statuses: number[] = [];
    for (const data of registrations) {
      const res = await fetch(`${urlBase}/directories`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const text = await res.text();
      statuses.push(res.status);
      if (res.status === 200) {
        const id = JSON.parse(text).id;
        directories.push(id);
        const metadata_registration = [
          { "key": "type", "value": "mammal" },
          { "key": "color", "value": "white" }
        ];
        for (const m of metadata_registration) {
          const res_metadata = await fetch(`${urlBase}/directories/${id}/metadata?key=${m.key}&value=${m.value}`, {
            method: "POST"
          });
          const text_metadata = await res_metadata.text();
        }  
      }
    }
    assertEquals(statuses.filter(function(n) { return n != 200; }).length, 0);
    if (directories.length !== registrations.length) {
      fail();
    }
  });

  await t.step("415: Create a directory with a plain text", async () => {
    const res = await fetch(`${urlBase}/directories`, {
      method: "POST",
      body: "plain text",
      headers: {
        "Content-Type": "text/plain",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 415);
  });

  await t.step("400: Create a directory with no content", async () => {
    const res = await fetch(`${urlBase}/directories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a directory with null content", async () => {
    const res = await fetch(`${urlBase}/directories`, {
      method: "POST",
      body: null,
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a directory without name", async () => {
    const res = await fetch(`${urlBase}/directories`, {
      method: "POST",
      body: JSON.stringify({
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("400: Create a duplicated directory", async () => {
    const res = await fetch(`${urlBase}/directories`, {
      method: "POST",
      body: JSON.stringify({
        name: "alpaca"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("200: Get a directory", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`);
    const text = await res.text();
    assertEquals(res.status, 200);
    assertEquals(JSON.parse(text).id, id);
  });

  await t.step("404: Get a directory with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000`);
    const text = await res.text();
    assertEquals(res.status, 404);
  });

  await t.step("400: Get a directory with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/invalid-uuid`);
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("200: Get all directories", async () => {
    const res = await fetch(`${urlBase}/directories`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 3);
  });

  await t.step("200: Get all directories with name", async () => {
    const res = await fetch(`${urlBase}/directories?name=alpaca`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 2);
  });

  await t.step("200: Get all directories with strict flag", async () => {
    const res = await fetch(`${urlBase}/directories?strict=true&name=alpaca`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 1);
  });

  await t.step("200: Get sites by directory", async () => {
    const site = await createASite("xenopus", "http://xenopus.com/", directories[0]);
    if (site === null) {
      fail();
    }
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}/sites`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    assertEquals(json.length, 1);
    if (site) {
      await deleteASite(site);
    }
  });

  await t.step("200: Get sites by directory with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000/sites`);
    const text = await res.text();
    assertEquals(res.status, 200);
  });

  await t.step("400: Get sites by directory with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/invalid-uuid/sites`);
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("200: Update a directory", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca2"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
  });

  await t.step("415: Update a directory with a plain text", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "PUT",
      body: "plain text",
      headers: {
        "Content-Type": "text/plain",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 415);
  });

  await t.step("400: Update a directory with no content", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("400: Update a directory with null content", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "PUT",
      body: null,
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("200: Update a directory without name", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "PUT",
      body: JSON.stringify({
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 200);
  });

  await t.step("400: Update a directory with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/invalid-uuid`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("404: Update a directory with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000`, {
      method: "PUT",
      body: JSON.stringify({
        name: "alpaca"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 404);
  });

  await t.step("400: Update a duplicated directory", async () => {
    const id = directories[0];
    const res = await fetch(`${urlBase}/directories/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "beaver"
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("204: Delete a directory", async () => {
    const statuses: number[] = [];
    while (directories.length > 0) {
      const id = directories.pop();
      const res = await fetch(`${urlBase}/directories/${id}`, {
        method: "DELETE"
      });
      statuses.push(res.status);
    }
    assertEquals(statuses.filter(function(n) { return n != 204; }).length, 0);
  });

  await t.step("400: Delete a directory with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/directories/invalid-uuid`, {
      method: "DELETE"
    }); 
    const text = await res.text();
    assertEquals(res.status, 400);
  });

  await t.step("404: Delete a directory with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000`, {
      method: "DELETE"
    }); 
    const text = await res.text();
    assertEquals(res.status, 404);
  });

});