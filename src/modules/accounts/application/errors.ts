export class ProfileNotFoundError extends Error {
  readonly code = "PROFILE_NOT_FOUND";

  constructor() {
    super("Profile not found");
    this.name = "ProfileNotFoundError";
  }
}

export class ValidationError extends Error {
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
