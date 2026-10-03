import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App Render", () => {
  it("renders POS App Foundation successfully", () => {
    render(<App />);
    expect(screen.getByText(/POS App Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/Milestone 1/i)).toBeInTheDocument();
  });
});
