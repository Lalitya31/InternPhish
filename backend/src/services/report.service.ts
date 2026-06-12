import type { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { detectRedFlags } from "./redFlag.service";

type UploadedFile = Express.Multer.File;

export type CreateReportInput = {
  companyName: string;
  internshipTitle: string;
  description: string;
  scamType?: string;
  feeAmount?: number;
  currency: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  reporterName?: string;
  reporterEmail?: string;
  location?: string;
};

export type SearchReportsInput = {
  companyName?: string;
  q?: string;
  minFee?: number;
  maxFee?: number;
  page: number;
  limit: number;
};

const fileUrls = (files?: UploadedFile[]) => files?.map((file) => `/uploads/${file.filename}`) ?? [];

export const createReport = async (input: CreateReportInput, files?: UploadedFile[]) => {
  const detectionText = [
    input.companyName,
    input.internshipTitle,
    input.description,
    input.scamType,
    input.contactEmail,
    input.websiteUrl
  ]
    .filter(Boolean)
    .join(" ");

  const { redFlags, riskScore } = detectRedFlags(detectionText, input.feeAmount);

  return prisma.report.create({
    data: {
      ...input,
      evidenceUrls: fileUrls(files),
      redFlags,
      riskScore
    }
  });
};

export const searchReports = async (input: SearchReportsInput) => {
  if (input.minFee !== undefined && input.maxFee !== undefined && input.minFee > input.maxFee) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "minFee cannot be greater than maxFee");
  }

  const where: Prisma.ReportWhereInput = {
    status: {
      not: "REMOVED"
    }
  };

  if (input.companyName) {
    where.companyName = { contains: input.companyName, mode: "insensitive" };
  }

  if (input.q) {
    where.OR = [
      { companyName: { contains: input.q, mode: "insensitive" } },
      { internshipTitle: { contains: input.q, mode: "insensitive" } },
      { description: { contains: input.q, mode: "insensitive" } },
      { scamType: { contains: input.q, mode: "insensitive" } }
    ];
  }

  if (input.minFee !== undefined || input.maxFee !== undefined) {
    where.feeAmount = {
      ...(input.minFee !== undefined ? { gte: input.minFee } : {}),
      ...(input.maxFee !== undefined ? { lte: input.maxFee } : {})
    };
  }

  const skip = (input.page - 1) * input.limit;
  const [items, total] = await prisma.$transaction([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: input.limit,
      select: {
        id: true,
        companyName: true,
        internshipTitle: true,
        scamType: true,
        feeAmount: true,
        currency: true,
        redFlags: true,
        riskScore: true,
        status: true,
        createdAt: true
      }
    }),
    prisma.report.count({ where })
  ]);

  return {
    items,
    pagination: {
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.ceil(total / input.limit)
    }
  };
};

export const getReportById = async (id: string) => {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      disputes: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!report || report.status === "REMOVED") {
    throw new ApiError(StatusCodes.NOT_FOUND, "Report not found");
  }

  return report;
};

export const getStats = async () => {
  const [totalReports, pendingReports, disputedReports, totalDisputes, topCompanies, riskAverage] =
    await prisma.$transaction([
      prisma.report.count({ where: { status: { not: "REMOVED" } } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "DISPUTED" } }),
      prisma.dispute.count(),
      prisma.report.groupBy({
        by: ["companyName"],
        where: { status: { not: "REMOVED" } },
        _count: { companyName: true },
        orderBy: { _count: { companyName: "desc" } },
        take: 10
      }),
      prisma.report.aggregate({
        where: { status: { not: "REMOVED" } },
        _avg: { riskScore: true }
      })
    ]);

  return {
    totalReports,
    pendingReports,
    disputedReports,
    totalDisputes,
    averageRiskScore: Math.round(riskAverage._avg.riskScore ?? 0),
    topCompanies: topCompanies.map((company) => ({
      companyName: company.companyName,
      reportCount: company._count.companyName
    }))
  };
};
