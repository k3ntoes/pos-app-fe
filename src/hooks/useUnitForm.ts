import {
  type CreateUnitInput,
  type UpdateUnitInput,
  createUnitSchema,
  updateUnitSchema,
} from "@/schemas/unit";
import type { Unit } from "@/types/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UseUnitFormProps {
  unit?: Unit | null;
  onSubmit: (data: CreateUnitInput | UpdateUnitInput) => void;
}

export function useUnitForm({ unit, onSubmit }: UseUnitFormProps) {
  const isEditing = !!unit;

  const form = useForm<CreateUnitInput | UpdateUnitInput>({
    resolver: zodResolver(isEditing ? updateUnitSchema : createUnitSchema),
    defaultValues: {
      code: "",
      name: "",
      address: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (unit) {
      form.reset({
        code: unit.code,
        name: unit.name,
        address: unit.address || "",
        is_active: unit.is_active,
      });
    } else {
      form.reset({
        code: "",
        name: "",
        address: "",
        is_active: true,
      });
    }
  }, [unit, form]);

  const codeError = (form.formState.errors as Record<string, { message?: string }>).code;

  return {
    form,
    isEditing,
    codeError,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
