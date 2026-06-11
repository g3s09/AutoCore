import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { routes } from "./routes.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());
app.use("/api", routes);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Datos invalidos",
      issues: error.issues,
    });
    return;
  }

  response.status(400).json({
    error: error instanceof Error ? error.message : "Error inesperado",
  });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`AutoCore backend listo en http://127.0.0.1:${port}/api`);
});
