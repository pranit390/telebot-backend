import { EntityType } from '@prisma/client';

type entity = {
  entityId: number;
  entityType: EntityType;
};

export function UserEntitiesByType(
  accessArray: entity[],
  entityType: EntityType,
): number[] {
  const data = accessArray.filter((el) => el.entityType === entityType);
  if (!data.length) {
    return [] as any;
  }

  return data.map((el) => el.entityId);
}
