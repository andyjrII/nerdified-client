"use client";

import { useState, useEffect, useRef } from "react";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PDFViewer = () => {
  const axiosPrivate = useAxiosPrivate();
  const [pdfData, setPdfData] = useState<string | null>(null);
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCourse = localStorage.getItem("NERDVILLE_COURSE");
      if (storedCourse) {
        setCourse(JSON.parse(storedCourse));
      }
    }
  }, []);

  useEffect(() => {
    const getCourseDetails = async () => {
      if (!course?.id) return;
      try {
        const response = await axiosPrivate.get(`courses/details/${course.id}`);
        setPdfData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (course) getCourseDetails();
  }, [course, axiosPrivate]);

  useEffect(() => {
    if (pdfData && pdfViewerRef.current) {
      // Use iframe for PDF viewing
      const iframe = document.createElement("iframe");
      iframe.src = pdfData;
      iframe.width = "100%";
      iframe.height = "800px";
      iframe.style.border = "none";

      pdfViewerRef.current.innerHTML = "";
      pdfViewerRef.current.appendChild(iframe);

      return () => {
        if (pdfViewerRef.current) {
          pdfViewerRef.current.innerHTML = "";
        }
      };
    }
  }, [pdfData]);

  if (!course || !pdfData) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={pdfViewerRef} className="w-full" />
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
