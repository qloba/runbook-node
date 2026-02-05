function isObject(value: any): boolean {
  return value !== null && typeof value === 'object';
}

function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function toUnderscore(s: string): string {
  return s.replace(/([A-Z])/g, function ($1) {
    return '_' + $1.toLowerCase();
  });
}

export function toCamel(s: string): string {
  return s.replace(/(_[a-z])/g, function ($1) {
    return $1.toUpperCase().replace('_', '');
  });
}

export function toUpperCamel(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + toCamel(s.slice(1));
}

export function deepSnakeCase(val: any): any {
  if (isArray(val)) {
    return val.map(function (v) {
      return deepSnakeCase(v);
    });
  } else if (isObject(val)) {
    const obj: { [key: string]: any } = {};
    Object.keys(val).forEach((k: string) => {
      obj[toUnderscore(k)] = deepSnakeCase(val[k]);
    });
    return obj;
  }
  return val;
}

export function deepCamelCase(val: any): any {
  if (isArray(val)) {
    return val.map(function (v) {
      return deepCamelCase(v);
    });
  } else if (isObject(val)) {
    const obj: { [key: string]: any } = {};
    Object.keys(val).forEach((k: string) => {
      obj[toCamel(k)] = deepCamelCase(val[k]);
    });
    return obj;
  }
  return val;
}
