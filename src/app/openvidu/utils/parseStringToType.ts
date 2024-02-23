export default function parseStringToType<T>(
  value: string,
  type: "string" | "number" | "boolean" | "array" | "object",
): T | undefined {
  switch (type) {
    case "string":
      return value as any as T;
    case "number":
      return parseFloat(value) as any as T;
    case "boolean":
      return value.toLowerCase() === "true"
        ? (true as any as T)
        : (false as any as T);
    case "array":
      try {
        return JSON.parse(value) as any as T;
      } catch (error) {
        console.error("Invalid JSON string for array type.");
        return undefined;
      }
    case "object":
      try {
        return JSON.parse(value) as any as T;
      } catch (error) {
        console.error("Invalid JSON string for object type.");
        return undefined;
      }
    default:
      console.error("Unsupported type.");
      return undefined;
  }
}
