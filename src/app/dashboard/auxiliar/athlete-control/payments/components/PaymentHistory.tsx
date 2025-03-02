"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentHistoryProps {
  payments: any[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        if (scrollTop + clientHeight === scrollHeight) {
          scrollRef.current.scrollTop = 0;
        } else {
          const newPosition = scrollTop + 1;
          scrollRef.current.scrollTop = newPosition;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Historial de Pagos</h3>
        <div className="flex items-center space-x-2">
          <Switch id="auto-scroll" checked={autoScroll} onCheckedChange={setAutoScroll} />
          <Label htmlFor="auto-scroll">Auto-scroll</Label>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[600px] overflow-y-auto px-6 pb-6"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence>
          {payments.map((payment, key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 rounded-lg border p-4 transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      "bg-muted text-muted-foreground ",
                    )}
                  >
                    {payment.amount > 0 ? (
                      <ArrowUpCircle className="size-6" />
                    ) : (
                      <ArrowDownCircle className="size-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{payment.payment_method || "Método desconocido"}</p>
                    {payment.transaction_reference && (
                      <p className="text-xs text-muted-foreground">
                        Ref: {payment.transaction_reference}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold",
                      payment.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {payment.amount > 0 ? "+" : "-"}S/ {Math.abs(payment.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
