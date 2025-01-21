"use server";
import { IClauseData } from "@/hooks/useClause";
import Report from "../models/Reports";
import dbConnect from "../lib/mongoose";
import AIReview from "../models/AIGeneratedReview";
import AISummary from "../models/AISummary";

export const reportAIReview = async (clauseId: string) => {
  await dbConnect();

  if (!clauseId) {
    return { message: "invalid input" };
  }
  try {
    const clause = await AIReview.findById(clauseId);
    if (!clause) {
      throw new Error("clause not found");
    }
    clause.isReported = true;
    await clause.save();
    return { message: "report created" };
  } catch (error) {
    return {
      message: error,
    };
  }
};

export const reportAISummary = async (summaryId: string) => {
  await dbConnect();

  if (!summaryId) {
    return { message: "invalid input" };
  }
  try {
    const summary = await AISummary.findById(summaryId);
    if (!summary) {
      throw new Error("summary not found");
    }
    summary.isReported = true;
    await summary.save();
    return { message: "report created" };
  } catch (error) {
    return {
      message: error,
    };
  }
};

export const getAllReports = async (documentId: string) => {
  try {
    await dbConnect();
    // const reports = await Report.find({ document: documentId }).lean();
    const reports = await Report.find({
      file: "678e3845904d27c238177dd4",
    }).lean();
    const parsedReports = JSON.parse(JSON.stringify(reports));
    return parsedReports;
  } catch (error) {
    return {
      message: error,
    };
  }
};
