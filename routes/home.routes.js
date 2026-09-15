import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";

export const homeRouter = Router();

/**
 * @swagger /api/home
 * GET /api/home
 *
 * @description Retrieve the home page message. Requires authentication.
 *
 * @success {200} { message: string }
 *   Returns the welcome message.
 *   Example: { message: "Welcome to the home page!" }
 *
 * @error {401} { error: string }
 *   User is not authenticated.
 *   Example: { error: "Unauthorized" }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
homeRouter.get("/home", checkAuth ,(req, res) => {
  // TODO: check authentication (JWT, session, etc.)
  res.json({ message: "Welcome to the home page!" });
});
