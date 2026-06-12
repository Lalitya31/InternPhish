import { StatusCodes } from "http-status-codes";
import { createDispute } from "../services/dispute.service";
import { asyncHandler } from "../utils/asyncHandler";

export const submitDispute = asyncHandler(async (req, res) => {
  const dispute = await createDispute(
    {
      reportId: req.params.reportId,
      ...req.body
    },
    req.files as Express.Multer.File[] | undefined
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: dispute
  });
});
