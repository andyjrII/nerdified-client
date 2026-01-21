import { TutorLayout } from "@/components/TutorLayout";

export default function TutorLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TutorLayout>{children}</TutorLayout>;
}
