import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { registerSchema } from "../schema/auth/register.schema.js";
import { loginSchema } from "../schema/auth/login.schema.js";


process.loadEnvFile();

export const authRouter = express.Router();
const db = createDB();
//export const authRouter = Router();



  /**
   * @swagger /auth/login
   * POST /auth/login
   *
   * @description Authenticate a user with email and password.
   *
   * @body {string} email - User's email address
   * @body {string} password - User's password
   *
   * @success {200} { message: string }
   *   Returns a success message on successful login.
   *
   * @error {422} { errors: { [field]: { errors: string[] } } }
   *   Validation failed (missing or invalid fields).
   *   Example: { errors: { email: { errors: ["Required"] }, password: { errors: ["Required"] } } }
   *
   * @error {500} { error: string }
   *   Internal server error.
   *   Example: { error: "something went wrong" }
   */
  authRouter.post("/login", validateBody(loginSchema) , async(req, res) => {

    // TODO: implement actual authentication (bcrypt, JWT, etc.)  

    // validate ✅

    // get user by email ✅
      const auth_users = await db.getAll("auth_users");
      const existingUser = auth_users.find((u) => u.email === req.body.email);

        if (!existingUser) {
          return res.status(422).json({
            error: "email or password are invalid",
          });
        }

    //  compare passwords
      const isValid = await bcrypt.compare( req.body.password , existingUser.passwordHash)

        if (!isValid) {
            return res.status(422).json({
              error: "email or password are invalid",
          });
        }

    // check email verification

    //   generate token
      
    const token = jwt.sign(existingUser , process.env.JWT_SECRET)

  // send response

    res.cookie("node_api_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

     return res.status(200).json({
        message: "login successful",
        data: {
          user: existingUser,
        },
      });
  });

  /**
   * @swagger /auth/register
   * POST /auth/register
   *
   * @description Register a new user account.
   *
   * @body {string} username - Desired username
   * @body {string} email - User's email address
   * @body {string} password - User's password
   * @body {string} password_confirmation - Password confirmation (must match password)
   *
   * @success {201} { message: string }
   *   Returns a success message on successful registration.
   *
   * @error {422} { errors: { [field]: { errors: string[] } } }
   *   Validation failed (missing fields or passwords don't match).
   *   Example: { errors: { email: { errors: ["Required"] }, password_confirmation: { errors: ["Passwords do not match"] } } }
   *
   * @error {500} { error: string }
   *   Internal server error.
   *   Example: { error: "something went wrong" }
   */
  authRouter.post("/register", validateBody(registerSchema) , async(req, res) => {

    // TODO: implement actual registration (hash password, save user, etc.)

      // validate data ✅

      // hash password ✅
       const passwordHash = await bcrypt.hash(req.body.password, 10);

      // check email is unique
       const authUser = await db.getAll("auth_users")
       const existingUser = authUser.find((u)=> u.email === req.body.email)

       if(existingUser){
        return res.status(422).json({
          error: "email already in use",
        });
       }

      //  add data to DB
        await db.create("auth_users", {
          email: req.body.email,
          username: req.body.username,
          passwordHash: passwordHash,
          // is_verified: false
         });


      // send response with verify request
         res.status(201).json({
            message: "register successful, check you email for verification",
           });
        });


  /**
   * @swagger /auth/logout
   * POST /auth/logout
   *
   * @description Log out the current user (invalidate session/token).
   *
   * @success {200} { message: string }
   *   Returns a success message on successful logout.
   *
   * @error {500} { error: string }
   *   Internal server error.
   *   Example: { error: "something went wrong" }
   */
  authRouter.post("/logout", (req, res) => {

    // TODO: implement actual logout (destroy session, invalidate token, etc.)
      res.clearCookie("node_api_token");
        return res.status(200).json({
          message: "logout successful",
        });

  });
