// @vitest-environment jsdom

import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={typeof href === "string" ? href : "#"} {...props}>
      {children}
    </a>
  )
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/app"
}));

afterEach(() => {
  cleanup();
});

describe("app shell", () => {
  it("renders the workspace navigation", async () => {
    let AppSidebar:
      | (() => React.JSX.Element)
      | undefined;

    try {
      ({ AppSidebar } = await import("../../src/components/layout/app-sidebar"));
    } catch {
      AppSidebar = undefined;
    }

    if (!AppSidebar) {
      throw new Error("AppSidebar is not available");
    }

    render(<AppSidebar />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/app"
    );
    expect(screen.getByText("Generate")).toBeInTheDocument();
    expect(screen.getByText("Background")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Credits" })).toHaveAttribute(
      "href",
      "/app/credits"
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/app/settings"
    );
  });

  it("shows the signed-in email and remaining credits", async () => {
    let Topbar:
      | ((props: { credits: number; email: string }) => React.JSX.Element)
      | undefined;

    try {
      ({ Topbar } = await import("../../src/components/layout/topbar"));
    } catch {
      Topbar = undefined;
    }

    if (!Topbar) {
      throw new Error("Topbar is not available");
    }

    render(<Topbar credits={42} email="seller@example.com" />);

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("seller@example.com")).toBeInTheDocument();
    expect(screen.getByText("42 credits remaining")).toBeInTheDocument();
  });
});
