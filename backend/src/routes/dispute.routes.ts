import { Router } from "express";
import { submitDispute } from "../controllers/dispute.controller";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { createDisputeSchema } from "../validators/dispute.validator";

export const disputeRouter = Router();

disputeRouter.post("/reports/:reportId/disputes", upload.array("screenshots", 5), validate(createDisputeSchema), submitDispute);
