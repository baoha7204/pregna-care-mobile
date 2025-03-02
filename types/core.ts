export type ApiResponse<T = any> = {
  statusCode: number;
  success: boolean;
  data: T | null;
  message?: string | null;
};
