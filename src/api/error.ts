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
  public status!: number;
  public code?: string;
  public type?: string;
  public request_id?: string;
  public details?: Array<Record<string, unknown>> | null;
  public errors?: Record<string, string[]>;

  constructor(payload: ApiErrorResponse) {
    super(payload.message);
    this.name = "ApiError";
    Object.assign(this, payload);
  }
}
