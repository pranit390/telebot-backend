import { EntityType, Role } from '@prisma/client';

export function AccessValidator(
  role: Role,
  accessArray: any[],
  entityId: number,
  entityType: EntityType,
) {
  if (role === Role.SUPER_ADMIN) return true;

  return accessArray.some(
    (el) => el.entityId == entityId && el.entityType === entityType,
  );
}
