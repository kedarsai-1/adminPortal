const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token;
let createdInventoryId;

describe("Inventory API", () => {

  // ✅ LOGIN FIRST
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test9.com",   // your login user
        password: "1234568"
      });

    token = loginRes.body.data.token;
  });

  // ✅ CREATE INVENTORY
  it("should create inventory", async () => {

    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: new mongoose.Types.ObjectId(), // ⭐ fake product id ok
        productName: "Tomato",
        currentStock: 100,
        unit: "kg",
        reorderLevel: 10
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdInventoryId = res.body.data._id;
  });

  // ✅ GET INVENTORY LIST
  it("should fetch inventory list", async () => {

    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ GET INVENTORY BY ID
  it("should fetch inventory by id", async () => {

    const res = await request(app)
      .get(`/api/inventory/${createdInventoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ UPDATE INVENTORY
  it("should update inventory", async () => {

    const res = await request(app)
      .put(`/api/inventory/${createdInventoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentStock: 120
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ ADD STOCK MOVEMENT
  it("should add stock movement", async () => {

    const res = await request(app)
      .post(`/api/inventory/${createdInventoryId}/movements`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "inward",
        quantity: 20,
        referenceType: "manual",
        remarks: "Test stock added"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ DELETE INVENTORY
  it("should delete inventory", async () => {

    const res = await request(app)
      .delete(`/api/inventory/${createdInventoryId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});

// ✅ CLOSE DB CONNECTION AFTER TESTS

