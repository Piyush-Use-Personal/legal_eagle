"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Flag, FlagOff } from "lucide-react";
import { IClauseData, useClause } from "@/hooks/useClause";
import { MoonLoader, RotateLoader } from "react-spinners";
import {
  getAllReports,
  reportAIReview,
} from "@/app/actions/report";
import { getAllReportsByDocumentId } from "@/app/actions/aIGeneratedReview";

interface IAIResults {
  onSelectedResult: (v: any) => void;
  onClose: () => void;
}

interface IReports {
  file: string;
  AIGeneratedReport: string;
}

const AIResults = ({ onSelectedResult, onClose }: IAIResults) => {
  const { clauses, handleClause, loading, document, setClauses } = useClause();
  const [reports, setReports] = useState<IReports[]>([]);

  useEffect(() => {
    if (document?._id) {
      handleClause(document?._id);
    }
  }, []);

  useEffect(() => {
    if (clauses?.length) {
      getReports();
    }
  }, [clauses]);

  const getReports = async () => {
    try {
      if (!document?._id) {
        return;
      }
      const result = await getAllReports(document?._id);
      setReports(result as any);
    } catch (error) {
      console.log(error);
    }
  };

  const reportReview = async (clauseId: string) => {
    try {
      if (!document?._id) {
        return;
      }
      await reportAIReview(clauseId);
      const clauses = await getAllReportsByDocumentId(document._id);
      setClauses(clauses);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-32">
        <RotateLoader color="#7FFFD4" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">AI Results</h3>

        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {clauses?.map((result, index) => (
        <div key={index} className="border rounded-lg p-4 relative">
          <div
            className={`flex items-center gap-2 mb-2 ${
              result.status === "Missing" ? "text-red-500" : "text-yellow-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {result.status}
            <div className="flex justify-end  text-red-500">
              {result.isReported && <div>Reported</div>}
            </div>
          </div>
          <h4 className="font-medium">{result.title}</h4>
          <p className="text-sm text-gray-600">{result.description}</p>

          <div className="absolute top-4 right-4 space-x-2">
            <Button
              size="icon"
              className="bg-red-400 h-8 w-8"
              onClick={() => reportReview(result._id as string)}
            >
             {result.isReported? <FlagOff className="h-4 w-4"  />: <Flag className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onSelectedResult(result)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIResults;
