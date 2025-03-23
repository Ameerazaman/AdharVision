const express = require('express');
const app = express();
import dotenv from 'dotenv';
import { ErrorRequestHandler, NextFunction } from 'express';
import path from 'path';
import createHttpError from 'http-errors';
import cors from 'cors';
import adhaarRouter from './Routes/AdharRouter';

dotenv.config();
const PORT = process.env.PORT || 3000;

// app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,

};
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use("/adhaar", adhaarRouter);


// 404 Not Found Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404));
  });

// Error Handling Middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
      status: err.status || 500,
      message: err.message,
    });
  };
  app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
