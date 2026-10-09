import { type ApiResponse } from '../types/index';

export const apiResponse = <T>(
  message: string,
  statusCode: number,
  data: T,
): ApiResponse<T> => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};
