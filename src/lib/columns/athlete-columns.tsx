import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Athlete } from "@/lib/types/AthleteTable";
import AthleteManage from "@/app/dashboard/components/athletes/AthleteManage";
import { DeleteAlert } from "@/app/dashboard/components/DeleteAlert";

export const athleteColumns = (
  handleEdit: (athlete: Athlete) => void,
  handleDelete: (id: string) => void,
  updateAthleteLevelMutation: any,
  updateAthleteStatusMutation: any,
  levelColors: Record<string, string>,
  statusColors: Record<string, string>,
  isOpen: boolean,
  onOpenChange: () => void,
): ColumnDef<Athlete>[] => {
  return [
    {
      accessorKey: "avatar_url",
      header: "Avatar",
      cell: ({ row }) => (
        <Image
          src={
            row.original.avatar_url ||
            "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png"
          }
          alt={`${row.original.first_name} ${row.original.paternal_last_name}`}
          width={40}
          height={40}
          className="rounded-full"
        />
      ),
    },
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "paternal_last_name",
      header: "Apellido Paterno",
    },
    {
      accessorKey: "maternal_last_name",
      header: "Apellido Materno",
    },
    {
      accessorKey: "birth_date",
      header: "Fecha de Nacimiento",
      cell: ({ row }) => new Date(row.original.birth_date).toLocaleDateString(),
    },
    {
      accessorKey: "dni",
      header: "DNI",
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "level",
      header: "Nivel",
      cell: ({ row }) => (
        <Select
          value={row.original.level}
          onValueChange={(value) =>
            updateAthleteLevelMutation.mutate({ id: row.original.id, level: value as string })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge className={`${levelColors[row.original.level]} text-white`}>
                {row.original.level}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Principiante</SelectItem>
            <SelectItem value="intermediate">Intermedio</SelectItem>
            <SelectItem value="advanced">Avanzado</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onValueChange={(value) =>
            updateAthleteStatusMutation.mutate({ id: row.original.id, status: value as string })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge className={`${statusColors[row.original.status]} text-white`}>
                {row.original.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Aprobado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <AthleteManage onClick={() => handleEdit(row.original)} modalId="athlete-modal" />
          <DeleteAlert
            isOpen={isOpen}
            onOpenChange={() => onOpenChange()}
            onDeleteMutation={() => handleDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];
};
