const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Auth API", () => {

  it("should login user successfully", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test9.com",
        password: "1234568"
      });

    console.log(res.body); // debug

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

});


