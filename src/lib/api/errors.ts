// API error handling utilities

import type { ApiError } from "./types";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }

  static fromApiError(error: ApiError): HttpError {
    return new HttpError(error.message, error.status, error.code, error.details);
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function handleError(error: unknown): never {
  if (isHttpError(error)) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new HttpError(error.message, 500, "INTERNAL_ERROR");
  }
  
  throw new HttpError("An unknown error occurred", 500, "UNKNOWN_ERROR");
}
