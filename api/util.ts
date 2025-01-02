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

export const getRange = function(value: string | null): number[] {
  if (typeof value === "undefined") return [0, 0];
  if (value === null) return [0, 0];
  else {
    const range = value.split("-").map(Number);
    if (range.length == 2) return range;
    else if (range.length == 1) return [range[0], range[0]];
    else return [0, 0];
  }
}

export const isUuid = function(value: string | null): boolean {
  if (typeof value === "undefined") return false;
  if (value === null) return false;
  else {
    return value.match("([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})") !== null;
  }
}

export const isTimestamp = function(value: string | null): boolean {
  if (typeof value === "undefined") return false;
  if (value === null) return false;
  else {
    return value.match("^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])([0-9]{6})$") !== null;
  }
}