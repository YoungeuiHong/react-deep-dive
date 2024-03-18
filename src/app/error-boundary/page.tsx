"use client";
import ErrorObject from "@/app/error-boundary/components/ErrorObject";
import { ErrorBoundary } from "@/app/error-boundary/components/ErrorBoundary";

export default function ErrorBoundaryPage() {
  return (
    <ErrorBoundary fallback={<p>에러가 발생했습니다.</p>}>
      <ErrorObject />
    </ErrorBoundary>
  );
}
