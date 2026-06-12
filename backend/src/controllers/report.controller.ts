import { StatusCodes } from "http-status-codes";
import { createReport, getReportById, getStats, searchReports } from "../services/report.service";
import { asyncHandler } from "../utils/asyncHandler";

export const submitReport = asyncHandler(async (req, res) => {
  const report = await createReport(req.body, req.files as Express.Multer.File[] | undefined);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: report
  });
});

export const listReports = asyncHandler(async (req, res) => {
  const result = await searchReports(req.query as never);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.items,
    pagination: result.pagination
  });
});

export const reportDetails = asyncHandler(async (req, res) => {
  const report = await getReportById(req.params.id);

  res.status(StatusCodes.OK).json({
    success: true,
    data: report
  });
});

export const stats = asyncHandler(async (_req, res) => {
  const result = await getStats();

  res.status(StatusCodes.OK).json({
    success: true,
    data: result
  });
});
