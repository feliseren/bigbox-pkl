export const CREATABLE_EMPLOYEE_ROLE_IDS = ["1", "2", "02", "03"] as const;

export function isCreatableEmployeeRoleId(roleId: string) {
  return CREATABLE_EMPLOYEE_ROLE_IDS.includes(
    roleId as (typeof CREATABLE_EMPLOYEE_ROLE_IDS)[number],
  );
}
