const request = require("supertest");
const app = require("../../src/app");
const UsersClass = require(`../../interfaces/classes/users`);
let Users = new UsersClass();

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should authenticate with valid credentials", async () => {
    const user = await Users.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/auth")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(response.status).toBe(200);
  });

  it("should not authenticate with invalid credentials", async () => {
    const user = await Users.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/auth")
      .send({
        email: user.email,
        password: "123456"
      });

    expect(response.status).toBe(401);
  });

  it("should return jwt token when authenticated", async () => {
    const user = await Users.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .post("/auth")
      .send({
        email: user.email,
        password: "123123"
      });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await Users.create("User", {
      password: "123123"
    });

    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to access private routes without jwt token", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(401);
  });

  it("should not be able to access private routes with invalid jwt token", async () => {
    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer 123123`);

    expect(response.status).toBe(401);
  });
});