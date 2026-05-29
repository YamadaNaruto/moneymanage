
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();
const multer = require("multer");
const upload = multer({dest: "uploads/"});
app.use(cors());
app.use("/uploads",express.static("uploads"))
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASS,
  database: "managemoney"
});

app.get("/api/paid", async (req, res) => {
  const { user_id } = req.query
  const [result] = await db.query("SELECT * FROM expenses WHERE user_id = ?", [user_id]);
  res.json(result);
});

app.post("/api/paid", upload.single("image"), async (req, res) => {
  const { amount, junre, user_id } = req.body
  const imagePath = req.file?.path
  try {
    await db.query("INSERT INTO expenses (amount, junre, image_path, user_id) VALUES (?,?,?,?)", [amount, junre, imagePath, user_id])
    res.json({ message: "登録完了" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

app.post("/api/loan", async (req, res) => {
  const { type, name, amount, year, month, user_id } = req.body
  const remainYear = type === "ローン" ? year : null
  const remainMonth = type === "ローン" ? month : null
  try {
    await db.query("INSERT INTO loans (type,name,amount,remain_year,remain_month,user_id) VALUES (?,?,?,?,?,?)", [type, name, amount, remainYear, remainMonth, user_id])
    res.json({ message: "登録完了" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

app.get("/api/goal", async (req, res) => {
  const { user_id } = req.query
  try {
    const [savings] = await db.query("SELECT * FROM savings WHERE user_id = ?", [user_id])
    res.json(savings)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})

app.post("/api/goal", async (req, res) => {
  const { type, amount, year, month, user_id } = req.body
  const goalYear = type === "目標貯金" ? year : null
  const goalMonth = type === "目標貯金" ? month : null
  try {
    await db.query("INSERT INTO savings (type,amount,goal_year,goal_month,user_id) VALUES (?,?,?,?,?)", [type, amount, goalYear, goalMonth, user_id])
    res.json({ message: "登録完了" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

app.get("/api/paidhis", async (req, res) => {
  const { year, month, junre, user_id } = req.query
  let sql = "SELECT * FROM expenses WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? AND user_id = ?"
  const params = [year, month, user_id]
  if (junre) {
    sql += " AND junre = ?"
    params.push(junre)
  }
  const [expenses] = await db.query(sql, params)
  const [loans] = await db.query(
    "SELECT * FROM loans WHERE created_at <= LAST_DAY(?) AND user_id = ?",
    [`${year}-${month}-01`, user_id]
  )
  res.json({ expenses, loans })
})

app.post("/api/savings", async (req, res) => {
  const { amount, user_id } = req.body
  try {
    await db.query(
      "UPDATE savings SET amount = amount - ? WHERE type = 'current' AND user_id = ?", [amount, user_id]
    )
    res.json({ message: "OK" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

app.listen('3000', () => {
  console.log("server running on http://localhost:3000");
});
