import { ProfileNotFoundError, ValidationError } from "./errors";
import type { ProfileData, ProfileRepository } from "./profile.repository";
import { profileRepository } from "../infra/database";

export interface UpdateProfileInput {
  name?: string;
  socialName?: string | null;
  timezone?: string;
  preferences?: Record<string, unknown>;
}

export class ProfileService {
  constructor(private repository: ProfileRepository = profileRepository) {}

  async getProfile(userId: string): Promise<ProfileData> {
    const profile = await this.repository.findByUserId(userId);

    if (!profile || !profile.timezone) {
      throw new ProfileNotFoundError();
    }

    return profile;
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<ProfileData> {
    const { name, socialName, timezone, preferences } = input;

    const hasUserFields = name !== undefined || socialName !== undefined;
    const hasProfileFields = timezone !== undefined || preferences !== undefined;

    if (!hasUserFields && !hasProfileFields) {
      throw new ValidationError("At least one field must be provided");
    }

    if (hasUserFields) {
      await this.repository.updateUser(userId, { name, socialName });
    }

    if (hasProfileFields) {
      await this.repository.updateProfileSettings(userId, { timezone, preferences });
    }

    const profile = await this.repository.findByUserId(userId);

    if (!profile) {
      throw new ProfileNotFoundError();
    }

    return profile;
  }
}

export const profileService = new ProfileService();
