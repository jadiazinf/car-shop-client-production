export const TypesHelpers = {
  isStringArray(arr: unknown): arr is string[] {
    return Array.isArray(arr) && arr.every((item) => typeof item === "string");
  },
  isFileArray(arr: unknown): arr is File[] {
    return Array.isArray(arr) && arr.every((item) => item instanceof File);
  },
};
