const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

describe("Prices API", () => {

  let token;
  let createdPriceId;

  /* ------------------------------------------------ */
  /* LOGIN FIRST                                      */
  /* ------------------------------------------------ */
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",   // ⭐ use your real test admin login
        password: "123456"
      });

    token = loginRes.body.data.token;
  }, 15000);

  /* ------------------------------------------------ */
  /* CREATE PRICE                                     */
  /* ------------------------------------------------ */
  it("should create price", async () => {

    const res = await request(app)
      .post("/api/prices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: new mongoose.Types.ObjectId(),
        productName: "Tomato",
        unit: "kg",

        prices: {
          min: 20,
          max: 30,
          average: 25
        },

        date: new Date()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdPriceId = res.body.data._id;
  });

  /* ------------------------------------------------ */
  /* GET ALL PRICES                                   */
  /* ------------------------------------------------ */
  it("should fetch prices", async () => {

    const res = await request(app)
      .get("/api/prices")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ------------------------------------------------ */
  /* GET PRICE BY ID                                  */
  /* ------------------------------------------------ */
  it("should fetch price by id", async () => {

    const res = await request(app)
      .get(`/api/prices/${createdPriceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ------------------------------------------------ */
  /* UPDATE PRICE                                     */
  /* ------------------------------------------------ */
  it("should update price", async () => {

    const res = await request(app)
      .put(`/api/prices/${createdPriceId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        prices: {
          min: 22,
          max: 35,
          average: 28
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ------------------------------------------------ */
  /* DELETE PRICE                                     */
  /* ------------------------------------------------ */
  it("should delete price", async () => {

    const res = await request(app)
      .delete(`/api/prices/${createdPriceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
