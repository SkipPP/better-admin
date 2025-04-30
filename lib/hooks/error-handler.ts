export function handleServerError(error: unknown, defaultMessage: string): never {
  if (error instanceof Error && error.message) {
    throw new Error(error.message);
  }

  throw new Error(defaultMessage);
}
