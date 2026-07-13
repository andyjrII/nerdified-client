"use client";

import { useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import { FaUniversity, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Bank {
  name: string;
  code: string;
}
interface BankDetails {
  bankName: string | null;
  bankCode: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  hasRecipient: boolean;
}

/**
 * Tutor payout bank account. Verifies the account with Paystack on save
 * (resolving the holder's name) so payouts can be disbursed to it.
 */
const BankDetailsCard = ({ axiosPrivate }: { axiosPrivate: AxiosInstance }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [details, setDetails] = useState<BankDetails | null>(null);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [banksRes, detailsRes] = await Promise.all([
          axiosPrivate.get("tutors/banks"),
          axiosPrivate.get("tutors/me/bank"),
        ]);
        setBanks(Array.isArray(banksRes?.data) ? banksRes.data : []);
        const d: BankDetails | null = detailsRes?.data ?? null;
        setDetails(d);
        if (d?.bankCode) setBankCode(d.bankCode);
        if (d?.bankAccountNumber) setAccountNumber(d.bankAccountNumber);
        // No saved account yet → start in edit mode.
        if (!d?.bankAccountNumber) setEditing(true);
      } catch (error) {
        console.error("Error loading bank details:", error);
      }
    })();
  }, [axiosPrivate]);

  const save = async () => {
    const bank = banks.find((b) => b.code === bankCode);
    if (!bank) {
      Swal.fire({ icon: "warning", title: "Select your bank" });
      return;
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      Swal.fire({ icon: "warning", title: "Enter a valid 10-digit account number" });
      return;
    }
    setSaving(true);
    try {
      const res = await axiosPrivate.patch("tutors/me/bank", {
        bankName: bank.name,
        bankCode: bank.code,
        accountNumber,
      });
      setDetails(res?.data ?? null);
      setEditing(false);
      Swal.fire({
        icon: "success",
        title: "Bank account saved",
        text: res?.data?.bankAccountName
          ? `Verified: ${res.data.bankAccountName}`
          : undefined,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Could not save bank account",
        text:
          err?.response?.data?.message ||
          "Please check the details and try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const banksUnavailable = banks.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaUniversity className="w-5 h-5 text-green-600" />
          Payout Bank Account
        </CardTitle>
        <p className="text-sm text-gray-500">
          Where your payouts are sent. Your account is verified with our payment
          provider.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!editing && details?.bankAccountNumber ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium flex items-center gap-2">
                {details.bankAccountName || "Account holder"}
                {details.hasRecipient && (
                  <FaCheckCircle className="w-3.5 h-3.5 text-green-600" />
                )}
              </p>
              <p className="text-gray-500">
                {details.bankName} ••••{details.bankAccountNumber.slice(-4)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Change
            </Button>
          </div>
        ) : (
          <>
            {banksUnavailable ? (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                Payouts aren&apos;t configured yet. You&apos;ll be able to add a
                bank account once the payment provider is set up.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bank">Bank</Label>
                    <select
                      id="bank"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select your bank…</option>
                      {banks.map((b) => (
                        <option key={`${b.code}-${b.name}`} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account number</Label>
                    <Input
                      id="accountNumber"
                      inputMode="numeric"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) =>
                        setAccountNumber(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="10-digit account number"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={save} disabled={saving}>
                    {saving ? "Verifying…" : "Save bank account"}
                  </Button>
                  {details?.bankAccountNumber && (
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BankDetailsCard;
