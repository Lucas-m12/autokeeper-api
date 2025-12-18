export interface ProfileData {
  id: string;
  name: string;
  socialName: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  planType: string;
  timezone: string | null;
  preferences: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserData {
  name?: string;
  socialName?: string | null;
}

export interface UpdateProfileSettingsData {
  timezone?: string;
  preferences?: Record<string, unknown>;
}

export interface ProfileRepository {
  findByUserId(userId: string): Promise<ProfileData | null>;
  updateUser(userId: string, data: UpdateUserData): Promise<void>;
  updateProfileSettings(userId: string, data: UpdateProfileSettingsData): Promise<void>;
}
