import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("debe renderizar el texto del botón", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("debe aplicar la variante primary por defecto", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-primary");
  });

  it("debe estar deshabilitado cuando disabled es true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("debe mostrar 'Cargando...' cuando isLoading es true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });
});
