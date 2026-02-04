import LiveSessionRoom from "@/components/live/LiveSessionRoom";
import { notFound } from "next/navigation";

interface LiveSessionPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams?: Promise<{ audience?: "student" | "tutor" }>;
}

export default async function LiveSessionPage({
  params,
  searchParams,
}: LiveSessionPageProps) {
  const { sessionId: sessionIdParam } = await params;
  const sessionId = Number(sessionIdParam);
  if (Number.isNaN(sessionId)) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const audience =
    resolvedSearchParams?.audience === "tutor" ? "tutor" : ("student" as const);

  return (
    <LiveSessionRoom sessionId={sessionId} audienceHint={audience} />
  );
}

