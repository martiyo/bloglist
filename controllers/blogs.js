const blogsRouter = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");

const userExtractor = require("../utils/userExtractorMiddleware");

/* const getTokenFrom = (request) => {
 *   const authorization = request.get("authorization");
 *   if (authorization && authorization.toLowerCase().startsWith("bearer")) {
 *     return authorization.substring(7);
 *   }
 *   return null;
 * }; */

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  const body = request.body;
  //const token = getTokenFrom(request);
  /* const decodedToken = jwt.verify(request.token, process.env.SECRET);
     * if (!decodedToken.id) {
     *   return response.status(401).json({ error: "token missing or invalid" });
     * }

     * const user = await User.findById(decodedToken.id); */

  const { userId } = request;

  const user = await User.findById(request.userId);

  if (!body.title && !body.url) {
    response.status(400).end();
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.url,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });

    const saveBlog = await blog.save();
    user.blogs = user.blogs.concat(saveBlog._id);
    await user.save();

    response.json(saveBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.url,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote.toJSON());
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
