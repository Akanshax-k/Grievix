"use client";

import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  success: boolean;
}

export default function SubmitButton({ loading, success }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading || success}
      className={`w-full h-12 rounded-full text-sm font-semibold shadow-sm transition-all duration-300
        ${success
          ? "bg-emerald-500 hover:bg-emerald-500"
          : "bg-[#3d8793] hover:bg-[#55959d] hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
        }
        text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Submitting Grievance...
        </>
      ) : success ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Grievance Submitted!
        </>
      ) : (
        <>
          Submit Grievance
          <Send className="w-3.5 h-3.5 ml-2" />
        </>
      )}
    </Button>
  );
}