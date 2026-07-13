export interface Course {
  id: number;
  title: string;
  description?: string;
  imagePath?: string | null;
  price: number;
  priceOneOnOne?: number;
  courseType: string;
  maxStudents?: number;
  maxOneOnOneStudents?: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: CourseEnrollment[];
  sessions?: SessionStub[];
}

export interface CourseEnrollment {
  id: number;
  status: string;
  paidAmount: number;
  dateEnrolled: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SessionStub {
  id: number;
  title: string | null;
  startTime: string;
  endTime: string;
  status: string;
  recordingUrl?: string | null;
}

export type StatusFilter = "all" | "draft" | "published";
