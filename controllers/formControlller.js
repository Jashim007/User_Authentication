import Form from "../models/formModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const existingUser = await Form.findOne({ email });
    if (!existingUser) {
      res.redirect("/register");
    } else {
      //encoding the "_id" using JWT
      let pwdMatched = await bcrypt.compare(password, existingUser.password);
      if (pwdMatched) {
        const token = jwt.sign(
          { id: existingUser._id },
          process.env.SECRET_KEY,
        );
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000000),
        });
        res.redirect("/");
      } else {
        res.render("login", { errMessage: "Incorrect Password" });
      }
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
}
async function registerHandler(req, res) {
  try {
    const { fname: fullName, email, password } = req.body;
    const existingUser = await Form.find({ email });
    if (existingUser.length != 0) {
      res.render("login.ejs", { errMessage: null });
    } else {
      let hashedPwd = await bcrypt.hash(password, 10);
      const newUser = await Form.create({
        fullName,
        email,
        password: hashedPwd,
      });
      //encoding the "_id" using JWT
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000000),
      });
      res.redirect("/");
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
}
async function logoutHandler(req, res) {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.redirect("/");
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
}
async function authenticationHandler(req, res) {
  const data = await Form.findById(req.userId);
  let { fullName } = data;
  res.render("logout.ejs", { fullName });
}
export { loginHandler, logoutHandler, authenticationHandler, registerHandler };
