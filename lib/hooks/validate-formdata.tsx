import { z } from "zod";

/**
 * Validates FormData for team operations
 * @param data - FormData to validate
 * @param schema - Zod schema to validate against
 * @throws {Error} if validation fails
 */
export function validateFormData<T>(
  data: FormData | unknown,
  schema: z.Schema<T>,
  error: string,
): T {
  if (!(data instanceof FormData)) {
    throw new Error(error);
  }

  const formData = Object.fromEntries(data.entries());

  return schema.parse(formData);
}
