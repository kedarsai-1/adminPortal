const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

describe("Analysis API", () => {
  let token;
  let productId;
  let inventoryId;
  let invoiceId;

  beforeAll(async () => {
    const uniqueEmail = `admin+ana+${Date.now()}@test.com`;
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Analysis Admin",
        email: uniqueEmail,
        password: "Passw0rd!",
        role: "admin"
      });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.success).toBe(true);
    token = registerRes.body.data.token;

    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Analytics Tomato",
        localName: "Tamatar",
        category: "vegetables",
        unit: "kg",
        pricing: { basePrice: 10, sellingPrice: 25 }
      });

    expect(productRes.statusCode).toBe(201);
    productId = productRes.body.data._id;

    const invRes = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: productId,
        productName: "Analytics Tomato",
        currentStock: 100,
        unit: "kg",
        reorderLevel: 10
      });

    expect(invRes.statusCode).toBe(201);
    inventoryId = invRes.body.data._id;

    const moveRes = await request(app)
      .post(`/api/inventory/${inventoryId}/movements`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "inward",
        quantity: 20,
        referenceType: "manual",
        remarks: "Seed stock"
      });

    expect(moveRes.statusCode).toBe(200);

    const invNum = `INV-A-${Date.now()}`;
    const invoiceRes = await request(app)
      .post("/api/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        invoiceNumber: invNum,
        invoiceType: "sale",
        customerName: "Analytics Buyer",
        items: [{
          productId: productId,
          name: "Analytics Tomato",
          quantity: 5,
          unit: "kg",
          rate: 25,
          amount: 125,
          totalAmount: 125
        }],
        subtotal: 125,
        grandTotal: 125
      });

    expect(invoiceRes.statusCode).toBe(201);
    invoiceId = invoiceRes.body.data._id;
  });

  it("should return KPI summary", async () => {
    const res = await request(app)
      .get("/api/analysis/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("totalProducts");
    expect(res.body.data).toHaveProperty("revenue");
  });

  it("should return sales trends", async () => {
    const res = await request(app)
      .get("/api/analysis/sales/trends?interval=day")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return top products", async () => {
    const res = await request(app)
      .get("/api/analysis/products/top?limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return low-stock items (may be empty)", async () => {
    const res = await request(app)
      .get("/api/analysis/inventory/low-stock")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return inventory movements summary", async () => {
    const res = await request(app)
      .get("/api/analysis/inventory/movements")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});