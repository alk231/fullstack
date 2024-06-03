const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  const request_body = req.body;

  const userObj = {
    username: request_body.username,
    email: request_body.email,
    password: bcrypt.hashSync(request_body.password, 10), // Use a salt rounds value of 10
  };

  try {
    const user_created = await User.create(userObj);
    const res_obj = {
      username: user_created.username,
      email: user_created.email,
      role: user_created.role,
      createdAt: user_created.createdAt,
      updatedAt: user_created.updatedAt,
    };
    res.status(201).send(res_obj);
  } catch (err) {
    console.log("Error while registering the user", err);
    res.status(500).send({
      message: "Some error happened while registering the user",
    });
  }
};

exports.signin = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send({
      message: "Invalid username or password",
    });
  }

  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Wrong password",
    });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: 120 });
  res.status(200).send({
    email: user.email,
    role: user.role,
    accessToken: token,
  });
};
