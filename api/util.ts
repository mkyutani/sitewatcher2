export const convertToJson = function(value: JSON | string | null): JSON | null {
  if (typeof value === "undefined") return null;
  if (value === null) return JSON.parse("{}");
  try {
    if (typeof value === "object") return value;
    else if (typeof value === "string") return JSON.parse(value);
    else return null;
  } catch (e) {
    return null
  }
}

export const convertToBoolean = function(value: boolean | string | null): boolean | null {
  if (typeof value === "undefined") return false;
  if (value === null) return false;
  else if (typeof value === "boolean") return value;
  else if (typeof value === "string") {
    const value_lower = value.toLowerCase();
    return (value_lower === "true" || value_lower === "") ? true : ((value_lower === "false") ? false : null);
  }
  else return null;
}

export const isUuid = function(value: string | null): boolean {
  if (typeof value === "undefined") return false;
  if (value === null) return false;
  else {
    return value.match("([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})") !== null;
  }
}