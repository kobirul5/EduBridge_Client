import { Suspense } from "react";
import VerifyOtpClient from "./VerifyOtpClient";

export const metadata = {
  title: "Verify Email — EduBridge",
  description: "Verify your email address using the OTP code sent to you.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const email = (resolvedParams.email as string) || "";
  const role = (resolvedParams.role as string) || "";

  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    }>
      <VerifyOtpClient email={email} role={role} />
    </Suspense>
  );
}
