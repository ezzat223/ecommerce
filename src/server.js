/* =============== imports =============== */
const express = require("express");
const morgan = require("morgan");

const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoutes");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddlewares");

/* =============== connect with db =============== */
dbConnection();

/* =============== express app =============== */
const app = express();

/* ============== Middlewares ==============
    - Everything in express is a Middleware
    - It is something that happens between firing a request till receiving a response [req - res cycle]
            - Middleware stack
                    Logging | Auth | JSON Parsing | Static files | Routing
                    - Moves from one another using => next()
*/
// parsing => Turns it into a js object
app.use(express.json());

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

/* =============== Mount Routes =============== */
// category
app.use("/api/v1/categories", categoryRoute);

// Error Handling for routes => send to Global Error Handling Middleware For ** express ** errors
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

/* =============== Global Error Handling Middleware =============== */
app.use(globalError);

/* ============== Listen ============== */
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, "localhost", () => {
  console.log(`App running on PORT ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

/* ============== Events ============== 
    To handle errors outside express
    process.on(event)
    Rejections => Promise => async
*/
// database errors handling
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  /*   if we exit there will be some requests that were already running so stop the server first
    which means finish running or pending requests first */
  server.close(() => {
    console.log("Shutting down server...");
    process.exit(1);
  });
});


