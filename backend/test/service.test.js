const request = require("supertest");
const app = require("../server");

describe("Services API", () => {
  let token;
  let createdServiceId;

  beforeAll(async () => {
    const uniqueEmail = `admin+svc+${Date.now()}@test.com`;
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Service Admin",
        email: uniqueEmail,
        password: "Passw0rd!",
        role: "admin"
      });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.success).toBe(true);
    token = registerRes.body.data.token;
  });

  it("should create a service", async () => {
    const res = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        serviceType: "transport",
        serviceName: "Test Transport",
        description: "Local transport",
        pricing: { type: "per_trip", rate: 500 },
        capacity: { value: 1, unit: "trip" }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    createdServiceId = res.body.data._id;
  });

  it("should list services", async () => {
    const res = await request(app)
      .get("/api/services")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should get a service by id", async () => {
    const res = await request(app)
      .get(`/api/services/${createdServiceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update a service", async () => {
    const res = await request(app)
      .put(`/api/services/${createdServiceId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        pricing: { type: "per_trip", rate: 600 }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should delete a service", async () => {
    const res = await request(app)
      .delete(`/api/services/${createdServiceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});