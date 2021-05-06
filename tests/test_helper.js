const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "linuxito.com",
    author: "linuxito",
    url: "linuxito.com",
    likes: 123,
  },

  {
    title: "notxorg nueva actitud",
    author: "notxorg",
    url: "notxorgnuevactitud.com",
    likes: 234,
  },

  {
    title: "ugeek",
    author: "ugeek",
    url: "ugeek.com",
    likes: 132,
  },
];

/* const nonExistingId = async () => {
 *   const note = new Note({ content: "willremovethissoon", date: new Date() });
 *   await note.save();
 *   await note.remove();
 *
 *   return note._id.toString();
 * };*/

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  //  nonExistingId,
  blogsInDb,
};
