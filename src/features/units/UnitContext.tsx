import { unitsApi } from "@/api/units";
import { useAuth } from "@/features/auth/AuthContext";
import type { Unit, UserRoleAssignment } from "@/types/unit";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface UnitContextType {
  units: Unit[];
  activeUnit: Unit | null;
  setActiveUnit: (unit: Unit | null) => void;
  userAssignments: UserRoleAssignment[];
  isLoadingUnits: boolean;
  refreshUnits: () => Promise<void>;
}

export const UnitContext = createContext<UnitContextType | undefined>(undefined);

const STORAGE_KEY = "pos_active_unit";

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [userAssignments, setUserAssignments] = useState<UserRoleAssignment[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState<boolean>(true);

  const [activeUnit, setActiveUnitState] = useState<Unit | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const setActiveUnit = useCallback((unit: Unit | null) => {
    setActiveUnitState(unit);
    if (unit) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unit));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUnits([]);
      setUserAssignments([]);
      setIsLoadingUnits(false);
      return;
    }

    try {
      setIsLoadingUnits(true);
      const [resUnits, fetchedAssignments] = await Promise.all([
        unitsApi.getUnits().catch(() => ({ units: [], total: 0 })),
        unitsApi.getUserUnits(user.id).catch(() => []),
      ]);

      const fetchedUnits = Array.isArray(resUnits) ? resUnits : resUnits?.units || [];

      setUnits(fetchedUnits);
      setUserAssignments(fetchedAssignments);

      if (fetchedUnits.length > 0) {
        const currentSaved = localStorage.getItem(STORAGE_KEY);
        let parsedSaved: Unit | null = null;
        if (currentSaved) {
          try {
            parsedSaved = JSON.parse(currentSaved);
          } catch {
            parsedSaved = null;
          }
        }

        const isValid = parsedSaved && fetchedUnits.some((u) => u.id === parsedSaved?.id);
        if (!isValid) {
          setActiveUnit(fetchedUnits[0]);
        } else if (parsedSaved) {
          setActiveUnitState(parsedSaved);
        }
      } else {
        setActiveUnit(null);
      }
    } catch {
      setUnits([]);
      setUserAssignments([]);
    } finally {
      setIsLoadingUnits(false);
    }
  }, [isAuthenticated, user, setActiveUnit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = {
    units,
    activeUnit,
    setActiveUnit,
    userAssignments,
    isLoadingUnits,
    refreshUnits: loadData,
  };

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
};

export const useUnit = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
};
