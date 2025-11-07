import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { CompanyTable } from "@/components/CompaniesPage/table";
import type { Company } from "@/types/company";

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Alpha Corp",
    created_at: "2024-01-01",
    employee_count: 30,
    founded: 2001,
    location: { city: "Cape Town", country: "South Africa" },
    industry: { primary: "Tech" },
  },
  {
    id: "2",
    name: "Beta LLC",
    created_at: "2024-01-02",
    employee_count: 12,
    founded: 2010,
    location: { city: "Johannesburg" },
    industry: { primary: "Finance" },
  },
];

describe("CompanyTable", () => {
  it("renders the correct number of rows", () => {
    renderWithProviders(
      <CompanyTable companies={mockCompanies} onDelete={() => {}} />,
    );

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(1 + mockCompanies.length);
  });

  it("renders company names", () => {
    renderWithProviders(
      <CompanyTable companies={mockCompanies} onDelete={() => {}} />,
    );

    expect(screen.getByText("Alpha Corp")).toBeInTheDocument();
    expect(screen.getByText("Beta LLC")).toBeInTheDocument();
  });

  it("fires onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();

    renderWithProviders(
      <CompanyTable companies={mockCompanies} onDelete={onDelete} />,
    );

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("fires onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();

    renderWithProviders(
      <CompanyTable
        companies={mockCompanies}
        onDelete={() => {}}
        onEdit={onEdit}
      />,
    );

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalled();
    expect(onEdit.mock.calls[0][0].id).toBe("1");
  });
});
