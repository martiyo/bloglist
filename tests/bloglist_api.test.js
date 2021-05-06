const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

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

test("identificator unique is named id", async () => {
  const response = await api.get("/api/blogs");
  const ids = response.body.map((r) => r.id);
  //  console.log(ids);
  expect(ids).toBeDefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "El universo perdido de GNU/emacs",
    author: "martiyo",
    url: "martiyo.github.io/faq",
    likes: 11,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map((b) => b.title);
  expect(contents).toContain("El universo perdido de GNU/emacs");
});

test("the property likes dont send, then equal 0", async () => {
  const newBlog = {
    title: "El titulo",
    author: "autor",
    url: "la url",
  };

  await api.post("/api/blogs").send(newBlog).expect(200);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
});

test("the properties title and url dont send, bad request!", async () => {
  const newBlog = {
    author: "autor",
    likes: 34,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});
