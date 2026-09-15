import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { homeRouter } from "./routes/home.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

app.use("/auth", authRouter);
app.use("/api", homeRouter);

app.use(express.static("pages"));

app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ error: "something went wrong" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
