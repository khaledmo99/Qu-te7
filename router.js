const express = require("express");
const router = express.Router();
const argon = require("argon2");
const database = require("./db_client");

router.get("/", (req, res) => {
  res.status(200).json(" Bienvenue chez moi");
});

router.get("/test", (req, res) => {
  res.status(200).json("Je suis sur ma 2eme route");
});

router.post("/test/newtest/:id", (req, res) => {
  const body = req.body;
  const params = req.params;
  const query = req.query;
  console.log("body :>> ", body);
  console.log("params :>> ", params);
  console.log("query :>> ", query);
  res.status(200).json("Je suis sur ma 2eme route");
});

router.get("/users", (req, res) => {
  database
    .query("select * from users")
    .then(([result]) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log("error :>> ", error);
      res.status(500).json(error);
    });
});

router.post("/user", async (req, res) => {
  const hashingOptions = {
    type: argon.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    paralleslism: 1,
  };

  try {
    const { firstname, lastname, email, city, language, password } = req.body;

    const hashedPassword = await argon.hash(password, hashingOptions);
    delete req.body.password;

    const user = await database.query(
      " insert into users (firstname, lastname, email, city, language, hashedPassword) values (?, ?, ? ,? ,?,?)",
      [firstname, lastname, email, city, language, hashedPassword]
    );
    console.log("user", user);
    res.status(200).json("user created");
  } catch (error) {
    res.status(500).json("user not created");
  }
});

module.exports = router;
