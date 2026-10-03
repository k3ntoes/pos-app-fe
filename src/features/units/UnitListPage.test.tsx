import { unitsApi } from "@/api/units";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnitListPage } from "./UnitListPage";

vi.mock("@/api/units", () => ({
  unitsApi: {
    getUnits: vi.fn(),
    createUnit: vi.fn(),
    updateUnit: vi.fn(),
    deleteUnit: vi.fn(),
  },
}));

const mockUnits = [
  {
    id: "1",
    code: "JKT-01",
    name: "Cabang Jakarta",
    address: "Jl. Sudirman",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "2",
    code: "BDG-01",
    name: "Cabang Bandung",
    address: "Jl. Asia Afrika",
    is_active: false,
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  },
];

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("UnitListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(unitsApi.getUnits).mockResolvedValue({
      units: mockUnits,
      total: mockUnits.length,
    });
  });

  it("renders units list correctly", async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <UnitListPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Manajemen Unit & Cabang")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Cabang Jakarta")).toBeInTheDocument();
      expect(screen.getByText("JKT-01")).toBeInTheDocument();
      expect(screen.getByText("Cabang Bandung")).toBeInTheDocument();
      expect(screen.getByText("BDG-01")).toBeInTheDocument();
    });
  });

  it("opens create unit modal when clicking tambah unit button", async () => {
    const queryClient = createTestQueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <UnitListPage />
      </QueryClientProvider>,
    );

    const addButton = screen.getByRole("button", { name: /\+ Tambah Unit/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Tambah Unit / Cabang Baru")).toBeInTheDocument();
    });
  });
});
