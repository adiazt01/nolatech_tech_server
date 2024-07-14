import request from "supertest";
import { app, prisma } from "../../src/app";

beforeAll(async () => {
  // Delete all user with email test@example.com
  await prisma.user.deleteMany({
    where: {
      email: "test@example.com",
    },
  });
});

describe("POST /api/auth/register", () => {
  test("should return a 200 status code and a cookie if the request is successful", async () => {
    const mockUserData = {
      email: "test@example.com",
      username: "testuser",
      password: "password",
    };

    // Ensure that the request to the test server is awaited
    const response = await request(app)
      .post("/api/auth/register")
      .send(mockUserData);

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body).toEqual({
      email: mockUserData.email,
      username: mockUserData.username,
    });
  }, 10000); // Increased timeout to 10000 ms because the test data is being sent to the database

  test("should return a 400 status code if the email is already in use", async () => {
    const mockUserData = {
      email: "test@example.com",
      password: "password",
      username: "testuser",
    };

    // Ensure that the request to the test server is awaited
    const response = await request(app)
      .post("/api/auth/register")
      .send(mockUserData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Email already in use" });
  }, 10000); // Increased timeout to 10000 ms because the test data is being sent to the database
});

describe("POST /api/auth/login", () => {
  test("should return a 200 status code and a cookie if the request is successful", async () => {
    const mockUserData = {
      email: "test@example.com",
      password: "password",
      username: "testuser",
    };

    // Ensure that the request to the test server is awaited
    const response = await request(app)
      .post("/api/auth/login")
      .send(mockUserData);

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.body).toEqual({
      email: mockUserData.email,
      username: mockUserData.username,
    });
  }, 10000);

  test("should return a 400 status code if the email is not found", async () => {
    const mockUserData = {
      email: "testFail@example.com",
      password: "password",
    };

    // Ensure that the request to the test server is awaited
    const response = await request(app)
      .post("/api/auth/login")
      .send(mockUserData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Invalid credentials" });
  }, 10000);

  test("should return a 400 status code if the password is incorrect", async () => {
    const mockUserData = {
      email: "test@example.com",
      password: "passwordIncorrect",
    };

    // Ensure that the request to the test server is awaited
    const response = await request(app)
      .post("/api/auth/login")
      .send(mockUserData);

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({ message: "Invalid credentials" });
  }, 10000);
});
