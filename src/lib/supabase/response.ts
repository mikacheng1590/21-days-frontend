export type SuccessResponse<TData> = {
  data: TData
  error: null
  success: true
}

export type ErrorResponse<TError> = {
  data: null
  error: TError
  success: false
}

export type Response<TData, TError> = SuccessResponse<TData> | ErrorResponse<TError>

// Helper function to handle Supabase response
export const handleResponse = <TData, TError>({ 
  data, 
  error 
}: { 
  data: TData | null, 
  error: TError | null 
}): Response<TData, TError> => {
  if (error) {
    return {
      data: null,
      error,
      success: false
    }
  }
  return {
    data: data as TData,
    error: null,
    success: true
  }
}