export default function normalizeSecuritySchemas(
  input: Record<string, string[] | boolean>[] | Record<string, string[] | boolean> | string[] | string
): Record<string, string[]>[] {
  if (Array.isArray(input)) {
    // Case: array of security objects
    if (typeof input[0] === "object" && input[0] !== null && !Array.isArray(input[0])) {
      return input as Record<string, string[]>[];
    }

    // Case: array of strings → convert to individual empty array schemas
    return (input as string[]).map((name) => ({ [name]: [] }));
  }

  if (typeof input === "string") {
    // Case: single string → wrap as array of one object
    return [{ [input]: [] }];
  }

  // Case: single object like { Auth1: true, Auth2: ["scope1"] }
  return Object.entries(input).map(([key, value]) => ({
    [key]: Array.isArray(value) ? value : [],
  }));
}