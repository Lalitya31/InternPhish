import { Router } from "express";
import { listReports, reportDetails, stats, submitReport } from "../controllers/report.controller";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { createReportSchema, reportIdSchema, searchReportsSchema } from "../validators/report.validator";

export const reportRouter = Router();

reportRouter.post("/", upload.array("screenshots", 5), validate(createReportSchema), submitReport);
reportRouter.get("/", validate(searchReportsSchema), listReports);
reportRouter.get("/stats", stats);
reportRouter.get("/:id", validate(reportIdSchema), reportDetails);
