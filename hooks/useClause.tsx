import { analyzeClause, summarizeClause } from "@/app/actions/clauseAnalysis";
import { createDocument } from "@/app/actions/document";
import { createContext, ReactNode, useContext, useState } from "react";

const ClauseContext = createContext<IClause>({
  clauses: [],
  summary: [],
  handleClause: () => {},
  setContent: () => {},
  setClauses: () => {},
  setSummary: () => {},
  setDocument: () => {},
  saveDocument: () => {},
  content: "",
  loading: false,
  document: {
    _id: "",
    content: "",
  },
  generateSummary: () => {},
});

interface IClause {
  clauses: IClauseData[];
  summary: IClauseSummary[];
  handleClause: (documentId: string) => void;
  setContent: (v: string) => void;
  saveDocument: (v: string) => void;
  setDocument: (v: IDocument) => void;
  setClauses: (v: IClauseData[]) => void;
  setSummary: (v: IClauseSummary[]) => void;
  content: string;
  loading: boolean;
  document: IDocument | null;
  generateSummary: () => void;
}

export interface IClauseData {
  title: string;
  description: string;
  status: "Needs Review" | "Missing" | string;
  isReported: boolean;
  _id?: string;
}

export interface IClauseSummary {
  title: string;
  summary: string;
  isReported: boolean;
  _id: string;
}

interface IDocument {
  _id: string;
  content: string;
}

const ClauseProvider = ({ children }: { children: ReactNode }) => {
  const [clauses, setClauses] = useState<IClauseData[]>([]);
  const [summary, setSummary] = useState<IClauseSummary[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<IDocument | null>(null);

  const saveDocument = async (data: string) => {
    try {
      const response = await createDocument(data);
      setDocument((response as any).data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClause = async (documentId: string) => {
    try {
      if (clauses?.length) {
        return;
      }
      setLoading(true);
      const result = await analyzeClause({ content, documentId });
      console.log({ result });
      setClauses(result as any);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      if (!document?._id) {
        return;
      }
      setLoading(true);
      const result = await summarizeClause(content, document?._id);
      setSummary(result as IClauseSummary[]);
      console.log({ result });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClauseContext.Provider
      value={{
        clauses,
        summary,
        handleClause,
        content,
        setContent,
        setDocument,
        saveDocument,
        setClauses,
        setSummary,
        loading,
        document,
        generateSummary,
      }}
    >
      {children}
    </ClauseContext.Provider>
  );
};

export default ClauseProvider;

export const useClause = () => useContext(ClauseContext);
