import { Suspense } from "react";
import ResultContent from "./ResultContent";

export const metadata = {
  title: "나의 컬러 결과 — LUMIYEON",
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center text-foreground/50">
          결과를 불러오는 중…
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
