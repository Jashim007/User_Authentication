import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import {
  loginHandler,
  logoutHandler,
  authenticationHandler,
  registerHandler,
} from "./controllers/formControlller.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

//connecting to mongoose db

mongoose
  .connect(process.env.DB_URL, { dbName: "Register" })
  .then(() => console.log("Database Connection Successful"))
  .catch((err) => console.log(err));

//Custom Middleware Function
const isUserAuthenticated = (req, res, next) => {
  if (req.cookies.token) {
    const { id } = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    req.userId = id;
    next();
  } else res.render("register.ejs");
};

//Middlewares

app.use(express.static(path.join(path.resolve(), "/public"))); //setting up the public folder for serving static pages
app.use(express.urlencoded({ entended: true })); //express.urlencoded() is a middleware used for handling URL-encoded data, especially from HTML forms.
app.use(cookieParser()); //parsing data from cookies

//Setting up view engine as EJS
app.set("view engine", "ejs");

//below route will basically act as an authentication route and it uses the custom middleware function "isUserAuthenticated"
app.get("/", isUserAuthenticated, authenticationHandler);

app.post("/login", loginHandler);
app.post("/register", registerHandler);
app.get("/logout", logoutHandler);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 8000");
});
