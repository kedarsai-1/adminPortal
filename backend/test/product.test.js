const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

describe("Products API", () => {

  let token;
  let createdProductId;

  /* ------------------------------------------- */
  /* LOGIN BEFORE TESTS                          */
  /* ------------------------------------------- */
  beforeAll(async () => {

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",   // ⭐ use your admin login
        password: "123456"
      });

    token = loginRes.body.data.token;

  }, 15000);

  /* ------------------------------------------- */
  /* CREATE PRODUCT                              */
  /* ------------------------------------------- */
  it("should create product", async () => {

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Tomato",
        localName: "Tamatar",
        category: "vegetables",
        unit: "kg",
        pricing: {
          basePrice: 10,
          sellingPrice: 25
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdProductId = res.body.data._id;
  });

  /* ------------------------------------------- */
  /* GET ALL PRODUCTS                            */
  /* ------------------------------------------- */
  it("should fetch products", async () => {

    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ------------------------------------------- */
  /* GET PRODUCT BY ID                           */
  /* ------------------------------------------- */
  it("should fetch product by id", async () => {

    const res = await request(app)
      .get(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ------------------------------------------- */
  /* UPDATE PRODUCT                              */
  /* ------------------------------------------- */
  it("should update product", async () => {

    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Tomato Grade A",
        pricing: {
          basePrice: 12,
          sellingPrice: 28
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ------------------------------------------- */
  /* DELETE PRODUCT (SOFT DELETE)                */
  /* ------------------------------------------- */
  it("should delete product", async () => {

    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
