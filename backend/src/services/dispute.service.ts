import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

type UploadedFile = Express.Multer.File;

export type CreateDisputeInput = {
  reportId: string;
  submitterName: string;
  submitterEmail: string;
  reason: string;
};

const fileUrls = (files?: UploadedFile[]) => files?.map((file) => `/uploads/${file.filename}`) ?? [];

export const createDispute = async (input: CreateDisputeInput, files?: UploadedFile[]) => {
  const report = await prisma.report.findUnique({
    where: { id: input.reportId },
    select: { id: true, status: true }
  });

  if (!report || report.status === "REMOVED") {
    throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
  }

  const dispute = await prisma.dispute.create({
    data: {
      reportId: input.reportId,
      submitterName: input.submitterName,
      submitterEmail: input.submitterEmail,
      reason: input.reason,
      evidenceUrls: fileUrls(files)
    }
  });

  await prisma.report.update({
    where: { id: input.reportId },
    data: { status: "DISPUTED" }
  });

  return dispute;
};
