"use client";

import { useState, useEffect } from "react";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Moment from "react-moment";
import { FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RescheduleRequest {
  id: number;
  sessionId: number;
  requestedStartTime: string;
  requestedEndTime: string;
  reason: string;
  status: string;
  session: {
    id: number;
    title: string | null;
    startTime: string;
    endTime: string;
    course: { id: number; title: string };
  };
}

const AdminRescheduleRequests = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<RescheduleRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get("admin/reschedule-requests", {
        withCredentials: true,
      });
      setRequests(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching reschedule requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once
  }, []);

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      await axiosPrivate.patch(
        `admin/reschedule-requests/${reviewModal.id}`,
        { status, adminNote: adminNote.trim() || undefined },
        { withCredentials: true }
      );
      Swal.fire({
        icon: "success",
        title: status === "APPROVED" ? "Approved" : "Rejected",
        confirmButtonColor: "#10b981",
      });
      setReviewModal(null);
      setAdminNote("");
      fetchRequests();
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Request failed";
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message || "Request failed",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reschedule Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Approve or reject tutor reschedule requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCalendarAlt className="w-5 h-5" />
            Pending ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 py-4">Loading…</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 py-4">No pending reschedule requests.</p>
          ) : (
            <ul className="space-y-4">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="border rounded-lg p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{req.session?.course?.title} – {req.session?.title || "Session"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Current: <Moment format="MMM D, YYYY h:mm A">{req.session?.startTime}</Moment>
                      {" → "}
                      <Moment format="h:mm A">{req.session?.endTime}</Moment>
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested: <Moment format="MMM D, YYYY h:mm A">{req.requestedStartTime}</Moment>
                      {" → "}
                      <Moment format="h:mm A">{req.requestedEndTime}</Moment>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Reason: {req.reason}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-700 border-green-300"
                      onClick={() => {
                        setReviewModal(req);
                        setAdminNote("");
                      }}
                    >
                      <FaCheck className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!reviewModal} onOpenChange={(open) => !open && setReviewModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve or reject reschedule</DialogTitle>
          </DialogHeader>
          {reviewModal && (
            <>
              <p className="text-sm text-gray-600">
                Session: {reviewModal.session?.course?.title} – {reviewModal.session?.title || "Session"}
              </p>
              <p className="text-sm text-gray-600">Reason: {reviewModal.reason}</p>
              <div className="space-y-2 py-2">
                <Label>Admin note (optional)</Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Note for the tutor"
                  rows={2}
                />
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModal(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => handleReview("REJECTED")}
              disabled={submitting}
            >
              <FaTimes className="w-3 h-3 mr-1" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleReview("APPROVED")}
              disabled={submitting}
            >
              <FaCheck className="w-3 h-3 mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRescheduleRequests;
