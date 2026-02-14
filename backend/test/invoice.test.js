const request = require("supertest");
const app = require("../server");

let token;
let createdInvoiceId;

describe("Invoices API", () => {

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test9.com",
        password: "1234568"
      });

    token = loginRes.body.data.token;
  });

  it("should create invoice", async () => {

    const res = await request(app)
      .post("/api/invoices")
      .set("Authorization", `Bearer ${token}`)
      .send({
        invoiceNumber: `INV-${Date.now()}`,
        invoiceType: "sale",
        invoiceDate: new Date(),
        customerName: "Test Customer",
        items: [
          {
            name: "Tomato",
            quantity: 10,
            unit: "kg",
            rate: 20,
            amount: 200,
            totalAmount: 200
          }
        ],
        subtotal: 200,
        grandTotal: 200
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    createdInvoiceId = res.body.data._id;
  });

  it("should fetch invoices", async () => {

    const res = await request(app)
      .get("/api/invoices")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should fetch invoice by id", async () => {

    const res = await request(app)
      .get(`/api/invoices/${createdInvoiceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should update invoice", async () => {

    const res = await request(app)
      .put(`/api/invoices/${createdInvoiceId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        notes: "Updated via test"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should add payment", async () => {

    const res = await request(app)
      .post(`/api/invoices/${createdInvoiceId}/payments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        method: "cash",
        reference: "TESTPAY"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should delete invoice", async () => {

    const res = await request(app)
      .delete(`/api/invoices/${createdInvoiceId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
