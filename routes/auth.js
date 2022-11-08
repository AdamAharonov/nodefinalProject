const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");
const joi = require("joi");

router.post("/", async (req, res) => {
  const { err } = validateUser(req, res);
  if (err) return res.status(400).send(err.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("incorrect email");

  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword)
    return res.status(400).send("wrong email and/or password");

  res.json({ chip: user.generateAuthToken(), biz: user.biz, id: user.id });
});

function signInPass(req) {
  const schema = joi.object({
    email: joi.string().min(6).max(255).required.email(),
    password: joi.string().min(6).max(1024).required(),
  });
  return schema.validate(req);
}

module.exports = router;
