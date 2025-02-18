"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAthletesAction,
  deleteAthleteAction,
  updateStatusAthleteAction,
  updateLevelAthleteAction,
} from "@/app/dashboard/actions/athleteActions";
import { useModalStore } from "@/lib/stores/useModalStore";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import AthleteManage from "@/app/dashboard/components/athletes/AthleteManage";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SkeletonTable from "@/app/dashboard/components/TableSkeleton";

type Athlete = {
  id: string;
  avatar_url: string;
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  birth_date: string;
  dni: string;
  phone: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "approved" | "rejected" | "pending";
};

const statusColors = {
  approved: "bg-green-500",
  rejected: "bg-red-500",
  pending: "bg-yellow-500",
};

const levelColors = {
  beginner: "bg-blue-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

export default function AthleteTable() {
  const { setModalOpen, setMode, setCurrentItem, setEntity, setId } = useModalStore();
  const queryClient = useQueryClient();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const { data: athletes = [], isLoading } = useQuery<Athlete[]>({
    queryKey: ["athletes"],
    queryFn: getAthletesAction,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAthleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

  const updateAthleteStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" | "pending" }) =>
      updateStatusAthleteAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

  const updateAthleteLevelMutation = useMutation({
    mutationFn: ({ id, level }: { id: string; level: "beginner" | "intermediate" | "advanced" }) =>
      updateLevelAthleteAction(id, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

  const handleEdit = (athlete: Athlete) => {
    athlete.birth_date = new Date(athlete.birth_date).toISOString().split("T")[0];
    setEntity("athlete");
    setMode("edit");
    setCurrentItem(athlete);
    setId(athlete.id);
    setModalOpen("athlete-modal", true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este atleta?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns: ColumnDef<Athlete>[] = [
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
            updateAthleteLevelMutation.mutate({ id: row.original.id, level: value as any })
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
            updateAthleteStatusMutation.mutate({ id: row.original.id, status: value as any })
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
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: athletes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
    },
  });

  if (isLoading) return <SkeletonTable />;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar por DNI..."
            value={(table.getColumn("dni")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("dni")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronUp className="size-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
