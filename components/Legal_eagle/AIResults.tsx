import React from "react";
import { Button } from "@/components/ui/button";
import { X, Edit } from "lucide-react";

export const mockAIResults = [
  {
    type: "Missing",
    title: "Indemnity",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    type: "Needs Review",
    title: "Warranty",
    description: "Lorem ipsum dolor sit amet, consectetur",
  },
  {
    type: "Needs Review",
    title: "Terms",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    type: "Missing",
    title: "Payments",
    description: "Lorem ipsum dolor sit amet, consectetur",
  },
];

interface IAIResults {
  onSelectedResult: (v: {
    type: string;
    title: string;
    description: string;
  }) => void;
  onClose: () => void;
}

const AIResults = ({ onSelectedResult, onClose }: IAIResults) => {
  return (
    <div className="space-y-4 mt-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">AI Results</h3>

        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {mockAIResults.map((result, index) => (
        <div key={index} className="border rounded-lg p-4 relative">
          <div
            className={`inline-flex items-center gap-2 mb-2 ${
              result.type === "Missing" ? "text-red-500" : "text-yellow-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {result.type}
          </div>
          <h4 className="font-medium">{result.title}</h4>
          <p className="text-sm text-gray-600">{result.description}</p>
          <div className="absolute top-4 right-4 space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onSelectedResult(result)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIResults;
