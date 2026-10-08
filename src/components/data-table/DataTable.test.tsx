import { render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { DataTable } from "./DataTable";

interface TestItem {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<TestItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const data: TestItem[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

describe("DataTable", () => {
  it("renders data correctly", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("renders loading state when isLoading is true", () => {
    render(<DataTable columns={columns} data={[]} isLoading={true} />);
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
  });

  it("renders empty message when data is empty and not loading", () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="Custom empty message" />);
    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });
});
