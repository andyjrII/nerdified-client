"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  /** Optional adornment on the right (e.g. a password show/hide toggle). */
  rightSlot?: React.ReactNode;
}

/** Icon-left text input styled for the auth screens. */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ icon, rightSlot, className, ...props }, ref) => (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <Input
        ref={ref}
        className={cn(
          "h-9 rounded-lg border-slate-200 bg-white pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500",
          rightSlot && "pr-10",
          className,
        )}
        {...props}
      />
      {rightSlot && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
      )}
    </div>
  ),
);
AuthField.displayName = "AuthField";
