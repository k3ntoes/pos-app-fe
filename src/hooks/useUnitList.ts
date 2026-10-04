import { unitsApi } from "@/api/units";
import type { CreateUnitInput, UpdateUnitInput } from "@/schemas/unit";
import type { Unit } from "@/types/unit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useUnitList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["units", search, statusFilter],
    queryFn: () =>
      unitsApi.getUnits({
        search: search || undefined,
        is_active:
          statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
      }),
  });

  const units = data?.units || [];
  const totalUnits = data?.total || units.length;
  const activeUnits = units.filter((u) => u.is_active).length;
  const inactiveUnits = units.filter((u) => !u.is_active).length;

  const createMutation = useMutation({
    mutationFn: (payload: CreateUnitInput) => unitsApi.createUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUnitInput }) =>
      unitsApi.updateUnit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsFormOpen(false);
      setSelectedUnit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => unitsApi.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsDeleteOpen(false);
      setUnitToDelete(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (unit: Unit) => unitsApi.updateUnit(unit.id, { is_active: !unit.is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleOpenCreate = () => {
    setSelectedUnit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUnit(null);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setUnitToDelete(null);
  };

  const handleFormSubmit = (formData: CreateUnitInput | UpdateUnitInput) => {
    if (selectedUnit) {
      updateMutation.mutate({ id: selectedUnit.id, payload: formData as UpdateUnitInput });
    } else {
      createMutation.mutate(formData as CreateUnitInput);
    }
  };

  const handleConfirmDelete = () => {
    if (unitToDelete) {
      deleteMutation.mutate(unitToDelete.id);
    }
  };

  const handleToggleStatus = (unit: Unit) => {
    toggleStatusMutation.mutate(unit);
  };

  return {
    search,
    statusFilter,
    isFormOpen,
    selectedUnit,
    isDeleteOpen,
    unitToDelete,
    units,
    totalUnits,
    activeUnits,
    inactiveUnits,
    isLoading,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
    handleSearch,
    handleFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseForm,
    handleCloseDelete,
    handleFormSubmit,
    handleConfirmDelete,
    handleToggleStatus,
  };
}
