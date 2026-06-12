import { Router } from "express";
import { disputeRouter } from "./dispute.routes";
import { reportRouter } from "./report.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "InternPhish backend is healthy"
  });
});

apiRouter.use("/reports", reportRouter);
apiRouter.use("/", disputeRouter);
