const ROLE_ID_TO_NAME: Record<string, string> = {
  "0": "admin",
  "01": "admin",
  "1": "marketing",
  "02": "marketing",
  "2": "project manager",
  "03": "project manager",
  admin: "admin",
  marketing: "marketing",
  project_management: "project manager",
};

export function normalizeEmployeeRole(value?: string | null) {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  return ROLE_ID_TO_NAME[normalized] ?? normalized;
}
