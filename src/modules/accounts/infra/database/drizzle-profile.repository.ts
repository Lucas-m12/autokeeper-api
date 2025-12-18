import { db } from "@/core/database";
import { users, usersProfile } from "@/core/database/schema";
import { eq } from "drizzle-orm";
import type {
  ProfileData,
  ProfileRepository,
  UpdateProfileSettingsData,
  UpdateUserData,
} from "../../application/profile.repository";

export class DrizzleProfileRepository implements ProfileRepository {
  async findByUserId(userId: string): Promise<ProfileData | null> {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        socialName: users.socialName,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        planType: users.planType,
        timezone: usersProfile.timezone,
        preferences: usersProfile.preferences,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(usersProfile, eq(users.id, usersProfile.userId))
      .where(eq(users.id, userId));

    if (!result[0]) return null;

    return {
      ...result[0],
      preferences: result[0].preferences as Record<string, unknown> | null,
    };
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<void> {
    const updates: Record<string, unknown> = {};

    if (data.name !== undefined) updates.name = data.name;
    if (data.socialName !== undefined) updates.socialName = data.socialName;

    if (Object.keys(updates).length > 0) {
      await db.update(users).set(updates).where(eq(users.id, userId));
    }
  }

  async updateProfileSettings(userId: string, data: UpdateProfileSettingsData): Promise<void> {
    const updates: Record<string, unknown> = {};

    if (data.timezone !== undefined) updates.timezone = data.timezone;
    if (data.preferences !== undefined) updates.preferences = data.preferences;

    if (Object.keys(updates).length > 0) {
      await db.update(usersProfile).set(updates).where(eq(usersProfile.userId, userId));
    }
  }
}
