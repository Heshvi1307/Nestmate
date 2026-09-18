const isDev = import.meta.env.DEV;

export const debugLog = (label: string, data?: unknown) => {
  if (isDev) console.log(`🔍 [NESTORA] ${label}`, data ?? '');
};

export const debugError = (label: string, error: unknown) => {
  console.error(`❌ [NESTORA] ${label}`, error);
};
