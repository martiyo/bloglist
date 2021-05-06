const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const saveUser = await user.save();

  response.json(saveUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.delete("/:id", async (request, response) => {
  await User.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = usersRouter;
