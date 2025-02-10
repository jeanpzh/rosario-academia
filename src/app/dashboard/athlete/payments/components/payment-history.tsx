import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentHistoryProps {
  isPaid: boolean;
  payments: {
    id: number;
    date: string;
    amount: string;
    method: string;
    status: string;
  }[];
}

export function PaymentHistory({ isPaid, payments }: PaymentHistoryProps) {
  if (isPaid) {
    payments.unshift();
  }

  return (
    <Table>
      <TableCaption>Historial de pagos recientes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.date}</TableCell>
            <TableCell>{payment.amount}</TableCell>
            <TableCell>{payment.method}</TableCell>
            <TableCell>{payment.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
