import { auditApi } from "@/api/audit";
import { apiClient } from "@/api/client";
import { AuditDiffViewerModal } from "@/features/audit/AuditDiffViewerModal";
import { AuditTable } from "@/features/audit/AuditTable";
import type { AuditLog } from "@/types/audit";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    user_id: "user-1",
    username: "superadmin",
    action: "CREATE",
    resource_type: "User",
    resource_id: "res-101",
    ip_address: "127.0.0.1",
    user_agent: "Mozilla/5.0",
    changes: {
      new_values: { name: "New User", email: "new@example.com" },
    },
    created_at: "2026-10-04T10:00:00Z",
  },
  {
    id: "log-2",
    user_id: "user-2",
    username: "cashier1",
    action: "UPDATE",
    resource_type: "Role",
    resource_id: "res-202",
    ip_address: "192.168.1.5",
    user_agent: "Chrome",
    changes: {
      old_values: { name: "Old Role" },
      new_values: { name: "Updated Role" },
    },
    created_at: "2026-10-04T11:00:00Z",
  },
  {
    id: "log-3",
    user_id: "user-1",
    username: "superadmin",
    action: "DELETE",
    resource_type: "Unit",
    resource_id: "res-303",
    ip_address: "127.0.0.1",
    user_agent: "Firefox",
    created_at: "2026-10-04T12:00:00Z",
  },
];

describe("Audit Module", () => {
  describe("AuditTable Component", () => {
    it("renders loading state correctly", () => {
      render(
        <AuditTable
          logs={[]}
          isLoading={true}
          page={1}
          totalPages={1}
          onPageChange={() => {}}
          onViewDetail={() => {}}
        />,
      );
      expect(screen.getByText(/Memuat data audit log.../i)).toBeInTheDocument();
    });

    it("renders empty state correctly", () => {
      render(
        <AuditTable
          logs={[]}
          isLoading={false}
          page={1}
          totalPages={1}
          onPageChange={() => {}}
          onViewDetail={() => {}}
        />,
      );
      expect(screen.getByText(/Tidak ada audit log ditemukan./i)).toBeInTheDocument();
    });

    it("renders logs and action badges correctly", () => {
      const handleViewDetail = vi.fn();
      render(
        <AuditTable
          logs={mockAuditLogs}
          isLoading={false}
          page={1}
          totalPages={1}
          onPageChange={() => {}}
          onViewDetail={handleViewDetail}
        />,
      );

      expect(screen.getAllByText("superadmin").length).toBeGreaterThan(0);
      expect(screen.getByText("cashier1")).toBeInTheDocument();
      expect(screen.getByText("CREATE")).toBeInTheDocument();
      expect(screen.getByText("UPDATE")).toBeInTheDocument();
      expect(screen.getByText("DELETE")).toBeInTheDocument();
      expect(screen.getAllByText("User").length).toBeGreaterThan(0);
      expect(screen.getByText("Role")).toBeInTheDocument();

      const detailButtons = screen.getAllByRole("button");
      expect(detailButtons.length).toBeGreaterThan(0);
      fireEvent.click(detailButtons[0]);
      expect(handleViewDetail).toHaveBeenCalledWith(mockAuditLogs[0]);
    });
  });

  describe("AuditDiffViewerModal Component", () => {
    it("renders diff modal with old and new values when open", () => {
      const handleClose = vi.fn();
      render(<AuditDiffViewerModal log={mockAuditLogs[1]} isOpen={true} onClose={handleClose} />);

      expect(screen.getByText(/Detail Perubahan Audit Log/i)).toBeInTheDocument();
      expect(screen.getByText("UPDATE")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByText(/Nilai Lama/i)).toBeInTheDocument();
      expect(screen.getByText(/Nilai Baru/i)).toBeInTheDocument();
      expect(screen.getByText(/"Old Role"/)).toBeInTheDocument();
      expect(screen.getByText(/"Updated Role"/)).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /Tutup/i }));
      expect(handleClose).toHaveBeenCalled();
    });

    it("returns null when log is null", () => {
      const { container } = render(
        <AuditDiffViewerModal log={null} isOpen={true} onClose={() => {}} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("auditApi Client", () => {
    it("fetches audit logs correctly with params", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockAuditLogs,
        meta: { page: 1, page_size: 10, total_items: 3, total_pages: 1 },
      });

      const res = await auditApi.getLogs({ page: 1, per_page: 10, search: "superadmin" });
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/audit-logs?page=1&per_page=10&search=superadmin"),
      );
      expect(res.data.length).toBe(3);
    });

    it("fetches audit log by id correctly", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: mockAuditLogs[0],
      });

      const log = await auditApi.getLogById("log-1");
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/audit-logs/log-1");
      expect(log.id).toBe("log-1");
    });
  });
});
