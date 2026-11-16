import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../../src/components/ui/Spinner";

describe("Spinner", () => {
  it("renderiza el spinner", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".spinner")).toBeInTheDocument();
  });
});
