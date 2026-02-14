const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token;
let createdLedgerId;

describe("Ledgers API", () => {

  // ✅ LOGIN FIRST
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test9.com",
        password: "1234568"
      });

    token = loginRes.body.data.token;
  });

  // ✅ CREATE LEDGER
  it("should create ledger", async () => {

    const res = await request(app)
      .post("/api/ledgers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        partyId: new mongoose.Types.ObjectId(), // fake user id ok
        partyName: "Test Party",
        partyType: "buyer",
        openingBalance: 1000,
        openingBalanceType: "debit"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdLedgerId = res.body.data._id;
  });

  // ✅ GET LEDGERS LIST
  it("should fetch ledgers", async () => {

    const res = await request(app)
      .get("/api/ledgers")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ GET LEDGER BY ID
  it("should fetch ledger by id", async () => {

    const res = await request(app)
      .get(`/api/ledgers/${createdLedgerId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ UPDATE LEDGER
  it("should update ledger", async () => {

    const res = await request(app)
      .put(`/api/ledgers/${createdLedgerId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        creditLimit: 5000
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ DELETE LEDGER (SOFT DELETE)
  it("should delete ledger", async () => {

    const res = await request(app)
      .delete(`/api/ledgers/${createdLedgerId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
