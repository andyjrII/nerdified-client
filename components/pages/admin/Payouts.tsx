"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAxiosPrivate } from "@/hooks/useAdminAxiosPrivate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import Moment from "react-moment";
import Swal from "sweetalert2";

interface Payout {
  id: number;
  tutorId: number;
  amount: number;
  commission: number;
  netAmount: number;
  status: string;
  paymentReference: string | null;
  paidAt: string | null;
  createdAt: string;
  tutor?: { id: number; name: string | null; email: string };
}

interface Balance {
  commissionRate: number;
  grossRevenue: number;
  netEarned: number;
  totalPaidOut: number;
  pendingNet: number;
  availableGross: number;
  availableNet: number;
}

const STATUS_FILTERS = ["", "PENDING", "PROCESSING", "COMPLETED", "FAILED"];

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };
  return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
};

const AdminPayouts = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [tutorId, setTutorId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const q = statusFilter ? `?status=${statusFilter}` : "";
      const res = await axiosPrivate.get(`payouts${q}`);
      setPayouts(res?.data?.items ?? []);
    } catch {
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate, statusFilter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const checkBalance = async () => {
    if (!tutorId) return;
    try {
      const res = await axiosPrivate.get(`payouts/tutor/${tutorId}/balance`);
      setBalance(res?.data ?? null);
    } catch (err: any) {
      setBalance(null);
      Swal.fire({
        icon: "error",
        title: "Could not load balance",
        text: err?.response?.data?.message || "Check the tutor ID and try again.",
      });
    }
  };

  const createPayout = async () => {
    if (!tutorId) return;
    setCreating(true);
    try {
      const payload: Record<string, unknown> = { tutorId: Number(tutorId) };
      if (amount) payload.amount = Number(amount);
      await axiosPrivate.post("payouts", payload);
      Swal.fire({ icon: "success", title: "Payout created", timer: 1500, showConfirmButton: false });
      setAmount("");
      setBalance(null);
      await fetchPayouts();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Could not create payout",
        text: err?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setCreating(false);
    }
  };

  const disburse = async (p: Payout) => {
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "Disburse this payout?",
      html: `This will transfer <b>${formatCurrency(
        p.netAmount
      )}</b> to ${p.tutor?.name ?? `Tutor #${p.tutorId}`}'s bank account via Paystack.`,
      showCancelButton: true,
      confirmButtonText: "Send transfer",
      confirmButtonColor: "#16a34a",
    });
    if (!isConfirmed) return;
    try {
      const res = await axiosPrivate.post(`payouts/${p.id}/disburse`);
      const status = res?.data?.status;
      Swal.fire({
        icon: "success",
        title:
          status === "COMPLETED" ? "Payout completed" : "Transfer initiated",
        text:
          status === "COMPLETED"
            ? "The transfer settled immediately."
            : "The transfer is processing; it will be confirmed shortly.",
        timer: 2200,
        showConfirmButton: false,
      });
      await fetchPayouts();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Disbursement failed",
        text: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const updateStatus = async (id: number, status: string) => {
    let paymentReference: string | undefined;
    if (status === "COMPLETED") {
      const { value, isConfirmed } = await Swal.fire({
        title: "Mark as completed",
        input: "text",
        inputLabel: "Payment / transfer reference (optional)",
        showCancelButton: true,
        confirmButtonText: "Complete payout",
      });
      if (!isConfirmed) return;
      paymentReference = value || undefined;
    }
    try {
      await axiosPrivate.patch(`payouts/${id}/status`, { status, paymentReference });
      await fetchPayouts();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Tutor Payouts</h1>
        <p className="text-gray-500">Settle tutor earnings and track payout status.</p>
      </div>

      {/* Create payout */}
      <Card>
        <CardHeader>
          <CardTitle>Create a payout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="tutorId">Tutor ID</Label>
              <Input
                id="tutorId"
                type="number"
                value={tutorId}
                onChange={(e) => setTutorId(e.target.value)}
                className="w-32"
                placeholder="e.g. 4"
              />
            </div>
            <Button variant="outline" onClick={checkBalance} disabled={!tutorId}>
              Check balance
            </Button>
            <div>
              <Label htmlFor="amount">Amount (gross, optional)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-40"
                placeholder="full balance"
              />
            </div>
            <Button onClick={createPayout} disabled={!tutorId || creating}>
              {creating ? "Creating…" : "Create payout"}
            </Button>
          </div>

          {balance && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                <p className="text-gray-500">Available (net)</p>
                <p className="font-bold text-green-700">{formatCurrency(balance.availableNet)}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                <p className="text-gray-500">Available (gross)</p>
                <p className="font-bold">{formatCurrency(balance.availableGross)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-gray-500">Gross revenue</p>
                <p className="font-bold">{formatCurrency(balance.grossRevenue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                <p className="text-gray-500">Commission</p>
                <p className="font-bold">{Math.round(balance.commissionRate * 100)}%</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payouts</CardTitle>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((s) => (
              <Button
                key={s || "all"}
                size="sm"
                variant={statusFilter === s ? "default" : "outline"}
                onClick={() => setStatusFilter(s)}
              >
                {s || "All"}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-400 py-8">Loading…</p>
          ) : payouts.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No payouts found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium">{p.tutor?.name ?? `Tutor #${p.tutorId}`}</p>
                      <p className="text-xs text-gray-500">{p.tutor?.email}</p>
                    </TableCell>
                    <TableCell>{formatCurrency(p.amount)}</TableCell>
                    <TableCell className="text-gray-500">{formatCurrency(p.commission)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(p.netAmount)}</TableCell>
                    <TableCell>
                      {statusBadge(p.status)}
                      {p.paymentReference && (
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[140px] truncate">
                          {p.paymentReference}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Moment format="MMM D, YYYY">{p.createdAt}</Moment>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(p.status === "PENDING" || p.status === "FAILED") && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => disburse(p)}
                          >
                            {p.status === "FAILED" ? "Retry transfer" : "Disburse"}
                          </Button>
                        )}
                        {(p.status === "PENDING" || p.status === "PROCESSING") && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(p.id, "COMPLETED")}>
                              Mark paid
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(p.id, "FAILED")}
                            >
                              Fail
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayouts;
