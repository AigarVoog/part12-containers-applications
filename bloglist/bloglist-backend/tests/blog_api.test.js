const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
let token;
let testUserId;

beforeAll(async () => {
  await User.deleteMany({});

  const loginTestUser = async () => {
    const testUser = { username: "testuser", password: "testpassword" };
    const response = await api.post("/api/login").send(testUser);
    return response.body.token;
  };

  const userResponse = await api.post("/api/users").send(helper.testUser);

  testUserId = userResponse.body.id;
  token = await loginTestUser();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogsWithUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: testUserId,
  }));
  await Blog.insertMany(blogsWithUser);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map((r) => r.title);
    expect(contents).toContain(helper.initialBlogs[0].title);
  });
});

describe("viewing a specific blog", () => {
  test("unique identifier property is 'id' and not '_id'", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const response = await api.get(`/api/blogs/${blogToView.id}`).expect(200);

    expect(response.body.id).toBeDefined();
    expect(response.body._id).toBeUndefined();
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "This is awesome",
      author: "Aigar Voog",
      url: "https://phonebook-aigar.fly.dev/",
      likes: 999,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("This is awesome");
  });

  test("blog without likes defaults to 0 likes", async () => {
    const newBlog = {
      title: "This is awesome",
      author: "Aigar Voog",
      url: "https://phonebook-aigar.fly.dev/",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);
    expect(response.body.likes).toBe(0);
  });

  test("blog without title is not added", async () => {
    const newBlog = {
      author: "Aigar Voog",
      url: "https://phonebook-aigar.fly.dev/",
      likes: 999,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("blog without url is not added", async () => {
    const newBlog = {
      title: "This is awesome",
      author: "Aigar Voog",
      likes: 999,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("adding a blog without a token fails with status code 401 Unauthorized", async () => {
    const newBlog = {
      title: "This is awesome",
      author: "Aigar Voog",
      url: "https://phonebook-aigar.fly.dev/",
      likes: 999,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("deletion of a blog", () => {
  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("deleting a blog without a token fails with status code 401 Unauthorized", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });
});

describe("editing of a blog", () => {
  test("a blog can be edited", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToEdit = blogsAtStart[0];

    const newBlogData = {
      title: "Updated Title",
      author: blogToEdit.author,
      url: blogToEdit.url,
      likes: blogToEdit.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogData)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const editedBlog = blogsAtEnd.find((b) => b.id === blogToEdit.id);

    expect(editedBlog.title).toBe(newBlogData.title);
    expect(editedBlog.likes).toBe(newBlogData.likes);
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("editing a blog without a token fails with status code 401 Unauthorized", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToEdit = blogsAtStart[0];

    const updatedBlogData = {
      title: "Updated Title",
      author: "Updated Author",
      url: blogToEdit.url,
      likes: blogToEdit.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(updatedBlogData)
      .expect(401);
  });
});

afterAll(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});
