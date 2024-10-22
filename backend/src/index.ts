import express from "express";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cookieParser());

app.use("/v1", rootRouter);

app.get("/", (req, res) => {
  res.json("hi there");
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));