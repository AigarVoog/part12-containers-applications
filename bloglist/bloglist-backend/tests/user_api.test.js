const bcrypt = require("bcrypt");
const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("pass123", 10);
    const user = new User({ username: "user1", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "user2",
      name: "user two",
      password: "password",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "user1",
      name: "user one",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("Username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails with proper status code and message if no username is given", async () => {
    const usersAtStart = await helper.usersInDb();
  
    const newUser = {
      name: "No Username",
      password: "password123",
    };
  
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  
    expect(result.body.error).toContain("Username and password are required");
  
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  
  test("creation fails with proper status code and message if no password is given", async () => {
    const usersAtStart = await helper.usersInDb();
  
    const newUser = {
      username: "nousername",
      name: "No Password",
    };
  
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  
    expect(result.body.error).toContain("Username and password are required");
  
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  
  test("creation fails with proper status code and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();
  
    const newUser = {
      username: "su",
      name: "Short Username",
      password: "password123",
    };
  
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  
    expect(result.body.error).toContain("Username and password must be at least 3 characters long");
  
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  
  test("creation fails with proper status code and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();
  
    const newUser = {
      username: "newuser",
      name: "Short Password",
      password: "sp",
    };
  
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  
    expect(result.body.error).toContain("Username and password must be at least 3 characters long");
  
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
