import { assertEquals, fail } from "../deps_test.ts";

const port = Number(Deno.env.get("API_PORT")) || 8089;
const urlBase = `http://localhost:${port}/api/v1`;

const directories: string[] = [];

Deno.test("200: Create a directory", async () => {
  const registrations = [
    {
      name: "alpaca",
      enabled: true
    },
    {
      name: "beaver",
      enabled: true
    },
    {
      name: "alpaca-child",
      enabled: false
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
      directories.push(JSON.parse(text).id);
    }
  }
  assertEquals(statuses.filter(function(n) { return n != 200; }).length, 0);
  if (directories.length !== registrations.length) {
    fail();
  }
});

Deno.test("415: Create a directory with a plain text", async () => {
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

Deno.test("400: Create a directory with no content", async () => {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("400: Create a directory with null content", async () => {
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

Deno.test("400: Create a directory without name", async () => {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    body: JSON.stringify({
      enabled: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("400: Create a directory without enabled flag", async () => {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    body: JSON.stringify({
      name: "alpaca"
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("400: Create a directory with invalid enabled flag", async () => {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    body: JSON.stringify({
      name: "alpaca",
      enabled: "ambiguous"
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("400: Create a duplicated directory", async () => {
  const res = await fetch(`${urlBase}/directories`, {
    method: "POST",
    body: JSON.stringify({
      name: "alpaca",
      enabled: true,
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("200: Get a directory", async () => {
  const id = directories[0];
  const res = await fetch(`${urlBase}/directories/${id}`);
  const text = await res.text();
  assertEquals(res.status, 200);
  assertEquals(JSON.parse(text).id, id);
});

Deno.test("404: Get a directory with unregistered uuid", async () => {
  const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000`);
  const text = await res.text();
  assertEquals(res.status, 404);
});

Deno.test("400: Get a directory with invalid uuid", async () => {
  const res = await fetch(`${urlBase}/directories/invalid-uuid`);
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("200: Get all directories", async () => {
  const res = await fetch(`${urlBase}/directories`);
  const text = await res.text();
  assertEquals(res.status, 200);
  const json = JSON.parse(text);
  assertEquals(json.length, directories.length);
});

Deno.test("200: Get all directories with name", async () => {
  const res = await fetch(`${urlBase}/directories?name=alpaca`);
  const text = await res.text();
  assertEquals(res.status, 200);
  const json = JSON.parse(text);
  assertEquals(json.length, 2);
});

Deno.test("200: Get all directories with strict flag", async () => {
  const res = await fetch(`${urlBase}/directories?strict=true&name=alpaca`);
  const text = await res.text();
  assertEquals(res.status, 200);
  const json = JSON.parse(text);
  assertEquals(json.length, 1);
});

Deno.test("200: Get all sites with name and enabled flag", async () => {
  const res = await fetch(`${urlBase}/directories?name=alpaca&enabled`);
  const text = await res.text();
  const json = JSON.parse(text);
  console.log(`${res.status} ${text}`);
  assertEquals(res.status, 200);
  assertEquals(json.length, 1);
});

Deno.test("200: Update a directory", async () => {
  const id = directories[0];
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: "alpaca2",
      enabled: false
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 200);
});

Deno.test("415: Update a directory with a plain text", async () => {
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

Deno.test("400: Update a directory with no content", async () => {
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

Deno.test("400: Update a directory with null content", async () => {
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

Deno.test("200: Update a directory without enabled flag", async () => {
  const id = directories[0];
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: "alpaca3"
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 200);
});

Deno.test("200: Update a directory without name", async () => {
  const id = directories[0];
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      enabled: true
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 200);
});

Deno.test("400: Update a directory with invalid uuid", async () => {
  const res = await fetch(`${urlBase}/directories/invalid-uuid`, {
    method: "PUT",
    body: JSON.stringify({
      name: "alpaca",
      enabled: true
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("404: Update a directory with unregistered uuid", async () => {
  const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000`, {
    method: "PUT",
    body: JSON.stringify({
      name: "alpaca",
      enabled: true
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 404);
});

Deno.test("400: Update a directory with invalid enabled flag", async () => {
  const id = directories[0];
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: "alpaca4",
      enabled: "ambiguous"
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("400: Update a duplicated directory", async () => {
  const id = directories[0];
  const res = await fetch(`${urlBase}/directories/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: "beaver",
      enabled: true,
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("204: Delete a directory", async () => {
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

Deno.test("400: Delete a directory with invalid uuid", async () => {
  const res = await fetch(`${urlBase}/directories/invalid-uuid`, {
    method: "DELETE"
  }); 
  const text = await res.text();
  assertEquals(res.status, 400);
});

Deno.test("404: Delete a directory with unregistered uuid", async () => {
  const res = await fetch(`${urlBase}/directories/00000000-0000-0000-0000-000000000000`, {
    method: "DELETE"
  }); 
  const text = await res.text();
  assertEquals(res.status, 404);
});