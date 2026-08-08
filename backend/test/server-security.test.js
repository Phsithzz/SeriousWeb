import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { app } from "../server.js";
import pool from "../Config/database.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

test("rejects unauthenticated admin requests", async () => {
  const response = await fetch(`${baseUrl}/products/admin`);
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { message: "Authentication required" });
});

test("rejects cross-origin mutation requests", async () => {
  const response = await fetch(`${baseUrl}/user/logout`, {
    method: "POST",
    headers: { Origin: "https://attacker.example" },
  });
  assert.equal(response.status, 403);
});

test("sets baseline security headers and hides framework identity", async () => {
  const response = await fetch(`${baseUrl}/not-a-route`);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-powered-by"), null);
});
