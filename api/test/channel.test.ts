import { assertEquals } from "../deps_test.ts";
import { IdNames, createTestDirectories, createTestSites, deleteTestDirectories, deleteTestSites, getTestUrlBase, printTestDirectories } from "../util_test.ts";

Deno.test("Channel", async (t) => {
  const urlBase = getTestUrlBase();
  const directories: IdNames = await createTestDirectories();
  const sites: IdNames = await createTestSites(directories);

  const channels: string[] = [];

  await t.step("200: Create channels", async () => {
    const res1 = await fetch(`${urlBase}/channels`, {
      method: "POST",
      body: JSON.stringify({
        name: "ch-apollo"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text1 = await res1.text();
    assertEquals(res1.status, 200);
    const json1 = JSON.parse(text1);
    console.log(json1);
    channels.push(json1.id);

    const res2 = await fetch(`${urlBase}/channels`, {
      method: "POST",
      body: JSON.stringify({
        name: "ch-bacchus"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text2 = await res2.text();
    assertEquals(res2.status, 200);
    const json2 = JSON.parse(text2);
    console.log(json2);
    channels.push(json2.id);
  });

  await t.step("400: Create a duplicated channel", async () => {
    const res = await fetch(`${urlBase}/channels`, {
      method: "POST",
      body: JSON.stringify({
        name: "ch-apollo"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("415: Create a channel with a plain text", async () => {
    const res = await fetch(`${urlBase}/channels`, {
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
  
  await t.step("400: Create a channel with no content", async () => {
    const res = await fetch(`${urlBase}/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Create a channel with null content", async () => {
    const res = await fetch(`${urlBase}/channels`, {
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

  await t.step("400: Create a channel without name", async () => {
    const res = await fetch(`${urlBase}/channels`, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("200: Get a channel", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
    assertEquals(json.id, id);
  });

  await t.step("200: Get a channel with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/channels/00000000-0000-0000-0000-000000000000`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 404);
  });

  await t.step("400: Get a channel with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/channels/invalid-uuid`);
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("200: List all channels", async () => {
    const res = await fetch(`${urlBase}/channels`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
    assertEquals(JSON.parse(text).length, 2);
  });

  Deno.test("200: Update a channel", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "ch-apollo-rev2"
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

  await t.step("400: Update a channel with duplicated name", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "ch-bacchus"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });

  await t.step("415: Update a channel with a plain text", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`, {
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
  
  await t.step("400: Update a channel with no content", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("400: Update a channel with null content", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`, {
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

  await t.step("200: Update a channel without name", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`, {
      method: "PUT",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Add a channel directory", async () => {
    const id = channels[0];
    const directory_id = directories["zebra"];
    const res = await fetch(`${urlBase}/channels/${id}/directories/${directory_id}`, {
      method: "POST",
      body: JSON.stringify({
        title: "${title}",
        description: "${description}"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Get a channel (again)", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
    assertEquals(json.id, id);
  });

  await t.step("200: Update a channel directory", async () => {
    const id = channels[0];
    const directory_id = directories["zebra"];
    const res = await fetch(`${urlBase}/channels/${id}/directories/${directory_id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: "title: ${title}",
        description: "description: ${description}"
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

  await t.step("200: Add a channel site", async () => {
    const id = channels[0];
    const site_id = sites["xenopus"];
    const res = await fetch(`${urlBase}/channels/${id}/sites/${site_id}`, {
      method: "POST",
      body: JSON.stringify({
        title: "${title}",
        description: "${description}"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Get a channel (again)", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
    assertEquals(json.id, id);
  });

  await t.step("200: Update a channel site", async () => {
    const id = channels[0];
    const site_id = sites["xenopus"];
    const res = await fetch(`${urlBase}/channels/${id}/sites/${site_id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: "title: ${title}",
        description: "description: ${description}"
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

  await t.step("200: Add a channel device", async () => {
    const id = channels[0];
    const device_name = "slack";
    const res = await fetch(`${urlBase}/channels/${id}/devices/${device_name}`, {
      method: "POST",
      body: JSON.stringify({
        interface: "slack",
        apikey: "xoxb-000000000000-000000000000-000000000000-000000000000",
        tag: "#slack-channel",
        template: "${description}\n{source}"
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Get a channel (again)", async () => {
    const id = channels[0];
    const res = await fetch(`${urlBase}/channels/${id}`);
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
    assertEquals(json.id, id);
  });

  await t.step("200: Update a channel device", async () => {
    const id = channels[0];
    const device_name = "slack";
    const res = await fetch(`${urlBase}/channels/${id}/devices/${device_name}`, {
      method: "PUT",
      body: JSON.stringify({
        template: "${title}\n${description}\n{source}"
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

  await t.step("200: Delete channel device", async () => {
    const id = channels[0];
    const device_name = "slack";
    const res = await fetch(`${urlBase}/channels/${id}/devices/${device_name}`, {
      method: "DELETE"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Delete channel site", async () => {
    const id = channels[0];
    const site_id = sites["xenopus"];
    const res = await fetch(`${urlBase}/channels/${id}/sites/${site_id}`, {
      method: "DELETE"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Delete channel directory", async () => {
    const id = channels[0];
    const directory_id = directories["zebra"];
    const res = await fetch(`${urlBase}/channels/${id}/directories/${directory_id}`, {
      method: "DELETE"
    });
    const text = await res.text();
    assertEquals(res.status, 200);
    const json = JSON.parse(text);
    console.log(json);
  });

  await t.step("200: Delete channels", async () => {
    const statuses: number[] = [];
    while (channels.length > 0) {
      const id = channels.pop();
      const res = await fetch(`${urlBase}/channels/${id}`, {
        method: "DELETE"
      });
      const text = await res.text();
      statuses.push(res.status);
      console.log(`${res.status} ${text}`);
    }
    assertEquals(statuses.filter(function(n) { return n != 200; }).length, 0);
  });

  await t.step("400: Delete a channel with invalid uuid", async () => {
    const res = await fetch(`${urlBase}/channels/invalid-uuid`, {
      method: "DELETE"
    });
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 400);
  });
  
  await t.step("404: Delete a channel with unregistered uuid", async () => {
    const res = await fetch(`${urlBase}/channels/00000000-0000-0000-0000-000000000000`, {
      method: "DELETE"
    }); 
    const text = await res.text();
    console.log(`${res.status} ${text}`);
    assertEquals(res.status, 404);
  });

  await printTestDirectories();
  await deleteTestSites();
  await deleteTestDirectories();  
});