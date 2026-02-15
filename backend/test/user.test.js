const request = require("supertest");
const app = require("../server");

describe("Users API", () => {
  let adminToken;
  let createdUserId;

  beforeAll(async () => {
    const uniqueEmail = `admin+${Date.now()}@test.com`;
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Admin",
        email: uniqueEmail,
        password: "Passw0rd!",
        role: "admin"
      });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.success).toBe(true);
    adminToken = registerRes.body.data.token;
  });

  it("should create a user (admin only)", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Sample User",
        email: `user+${Date.now()}@test.com`,
        password: "123456",
        role: "buyer"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    createdUserId = res.body.data._id;
  });

  it("should list users (admin only)", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get user by id (admin only)", async () => {
    const res = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update a user (admin only)", async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Sample User" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should delete user (admin only)", async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});