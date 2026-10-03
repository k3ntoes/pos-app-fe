export interface ApiErrorResponse {
  message: string;
  code?: string;
  type?: string;
  request_id?: string;
  details?: Array<Record<string, unknown>> | null;
  errors?: Record<string, string[]>;
  status: number;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public type?: string;
  public request_id?: string;
  public details?: Array<Record<string, unknown>> | null;
  public errors?: Record<string, string[]>;

  constructor({ message, code, type, request_id, details, errors, status }: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.type = type;
    this.request_id = request_id;
    this.details = details;
    this.errors = errors;
  }
}
