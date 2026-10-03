import type { Role } from "./auth";

export interface Unit {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateUnitPayload {
  code: string;
  name: string;
  address?: string | null;
  is_active?: boolean;
}

export interface UpdateUnitPayload {
  name?: string | null;
  address?: string | null;
  is_active?: boolean | null;
}

export interface UnitListResponse {
  units: Unit[];
  total: number;
}

export interface UnitFilterParams {
  is_active?: boolean;
  search?: string;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  unit_id: string | null;
  role: Role;
  unit?: Unit | null;
}
