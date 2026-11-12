// Clases de error personalizadas para la API

export class ApiError extends Error {
  status: number;
  details?: { campo: string; mensaje: string }[];

  constructor(message: string, status: number, details?: { campo: string; mensaje: string }[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "No autenticado") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Sin permiso") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Error de validación", details?: { campo: string; mensaje: string }[]) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflicto") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message = "Demasiadas solicitudes") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}
