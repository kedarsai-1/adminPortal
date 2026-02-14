const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token;
let createdBusinessId;

describe("Businesses API", () => {

  // ✅ LOGIN BEFORE ALL TESTS
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test9.com",   // your test login
        password: "1234568"
      });

    token = loginRes.body.data.token;
  });

  // ✅ GET BUSINESSES
  it("should fetch businesses", async () => {

    const res = await request(app)
      .get("/api/businesses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ CREATE BUSINESS
  it("should create business", async () => {

    const res = await request(app)
      .post("/api/businesses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Business",
        type: "retail_shop",        // ⭐ REQUIRED FIELD
        contact: {
          email: "test@business.com",
          phone: "9876543210"
        },
        address: {
          city: "Guntur",
          state: "AP"
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdBusinessId = res.body.data._id;
  });

  // ✅ UPDATE BUSINESS
  it("should update business", async () => {

    const res = await request(app)
      .put(`/api/businesses/${createdBusinessId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Business Name"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ GET BUSINESS BY ID
  it("should fetch business by id", async () => {

    const res = await request(app)
      .get(`/api/businesses/${createdBusinessId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ DELETE BUSINESS (SOFT DELETE)
  it("should delete business", async () => {

    const res = await request(app)
      .delete(`/api/businesses/${createdBusinessId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});


// ✅ CLOSE MONGODB AFTER TESTS
