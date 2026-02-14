const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let token;
let createdLotId;

describe("Lots API", () => {

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

  // ✅ CREATE LOT
  it("should create lot", async () => {

    const res = await request(app)
      .post("/api/lots")
      .set("Authorization", `Bearer ${token}`)
      .send({
        lotNumber: `LOT-${Date.now()}`, // must be unique
        auctionDate: new Date(),
        sellerId: new mongoose.Types.ObjectId(),
        sellerName: "Test Seller",
        productId: new mongoose.Types.ObjectId(),
        productName: "Tomato",
        quantity: {
          value: 100,
          unit: "kg"
        },
        startingPrice: 20
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdLotId = res.body.data._id;
  });

  // ✅ GET LOTS LIST
  it("should fetch lots", async () => {

    const res = await request(app)
      .get("/api/lots")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ GET LOT BY ID
  it("should fetch lot by id", async () => {

    const res = await request(app)
      .get(`/api/lots/${createdLotId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ UPDATE LOT
  it("should update lot", async () => {

    const res = await request(app)
      .put(`/api/lots/${createdLotId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        startingPrice: 25
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ✅ DELETE LOT (SOFT CANCEL)
  it("should cancel lot", async () => {

    const res = await request(app)
      .delete(`/api/lots/${createdLotId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
