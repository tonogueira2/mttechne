const request = require("supertest");
const app = require("../../src/app");
const OrdersClass = require(`../../interfaces/classes/orders`);
let Orders = new OrdersClass();

describe("Authentication", () => {
    beforeEach(async () => {
        await truncate();
    });

    it("should authenticate with valid credentials", async () => {
        const order = await Orders.create("Order", {
            valor: 12.25,
            descricao: 'descricao',
            fechado: 'fechado',
        });

        const response = await request(app)
            .post("/orders/")
            .send({
                valor: 12.25,
                descricao: 'descricao',
                fechado: 'fechado',
            });

        expect(response.status).toBe(200);
    });

    it("should not authenticate with invalid credentials", async () => {
        const order = await Orders.create("Order", {
            valor: 12.25,
                descricao: 'descricao',
                fechado: 'fechado',
        });

        const response = await request(app)
            .post("/orders")
            .send({
                email: order.email,
                valor: 12.25,
                descricao: 'descricao',
                fechado: 'fechado',
            });

        expect(response.status).toBe(401);
    });

    it("should return jwt token when authenticated", async () => {
        const order = await Orders.create("Order", {
            password: "123123"
        });

        const response = await request(app)
            .post("/orders")
            .send({
                email: order.email,
                valor: 12.25,
                descricao: 'descricao',
                fechado: 'fechado',
            });

        expect(response.body).toHaveProperty("token");
    });

    it("should be able to access private routes when authenticated", async () => {
        const order = await Orders.create("Order", {
            email: order.email,
                valor: 12.25,
                descricao: 'descricao',
                fechado: 'fechado',
        });

        const response = await request(app)
            .get("/")
            .set("Authorization", `Bearer ${order.generateToken()}`);

        expect(response.status).toBe(200);
    });

});