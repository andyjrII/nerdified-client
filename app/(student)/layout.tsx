import { StudentLayout } from "@/components/StudentLayout";

export default function StudentLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentLayout>{children}</StudentLayout>;
}
