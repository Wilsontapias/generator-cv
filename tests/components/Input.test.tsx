import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("debe renderizar el label asociado", () => {
    render(<Input label="Nombre" />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("debe mostrar mensaje de error cuando se proporciona", () => {
    render(<Input label="Email" error="Correo inválido" />);
    expect(screen.getByText("Correo inválido")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("debe mostrar hint cuando se proporciona", () => {
    render(<Input label="Teléfono" hint="Formato: +57 300 123 4567" />);
    expect(screen.getByText("Formato: +57 300 123 4567")).toBeInTheDocument();
  });

  it("debe permitir escribir texto", async () => {
    const user = userEvent.setup();
    render(<Input label="Nombre" />);
    const input = screen.getByLabelText("Nombre");
    await user.type(input, "Wilson");
    expect(input).toHaveValue("Wilson");
  });
});
