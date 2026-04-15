/**
 * Exhaustiveness helper for discriminated-union switches. Call this from the
 * default branch so adding a new variant later becomes a compile error
 * instead of a silently-dropped case at runtime.
 */
export function assertNever(x: never): never {
  throw new Error(`Unhandled discriminated union variant: ${JSON.stringify(x)}`);
}
