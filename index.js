const express = require('express');
const dotenv = require('dotenv');
const db = require('./db/db.js');
const userRoutes = require('./routes/userRoutes.js');
const productRouter = require('./routes/productRouter.js');
const billRouter = require("./routes/billRouter.js");
const tableRouter = require("./routes/tableRouter.js");
const categoryRouter = require('./routes/categoryRouter');
const reportRouter = require("./routes/reportRoutes.js");
const cookieParser = require('cookie-parser');
const cors = require('cors');


dotenv.config();
const app = express();

// const PORT = process.env.PORT;

app.use(cors({
  // origin: "http://localhost:3000",
  origin: "https://frontend-restaurant-booking.vercel.app/",
  methods: ["GET", "POST", "PUT", 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/user",userRoutes );
app.use("/api/product",productRouter );
app.use("/api/bill",billRouter);
app.use("/api/table", tableRouter);
app.use('/api/category', categoryRouter);
app.use("/api/report", reportRouter);

db();

module.exports = app;