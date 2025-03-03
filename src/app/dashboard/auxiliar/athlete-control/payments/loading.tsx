import React from "react";
import { PaymentsListSkeleton } from "./components/skeletons/PaymentListSkeleton";

export default function loading() {
  return <PaymentsListSkeleton />;
}
