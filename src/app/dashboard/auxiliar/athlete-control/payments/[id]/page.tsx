import { AthleteHeader } from "../../../../components/AthleteHeader";
import { PaymentHistory } from "../../../../components/PaymentHistory";
import { getAthleteById, getPaymentsWithMethods } from "@/app/dashboard/actions/athleteActions";

export default async function PaymentsByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const athlete = await getAthleteById(id);
  const payments = await getPaymentsWithMethods(id);
  return (
    <div className="container mx-auto space-y-6 p-6">
      <AthleteHeader athlete={athlete} />
      <PaymentHistory payments={payments || []} />
    </div>
  );
}
