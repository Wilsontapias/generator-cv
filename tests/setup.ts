import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock de server-only para pruebas
vi.mock("server-only", () => ({}));
