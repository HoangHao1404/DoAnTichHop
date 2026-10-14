const crypto = require("crypto");

jest.mock("bcrypt", () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock("../src/services/user/user.repository", () => ({
  findByEmail: jest.fn(),
  findByPhone: jest.fn(),
  getNextUserId: jest.fn(),
  create: jest.fn(),
  updateLoginAttemptsByEmail: jest.fn(),
  updateLoginAttemptsByPhone: jest.fn(),
}));
jest.mock("../src/services/user/user.model", () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));
jest.mock("../src/services/auth/passwordResetEmail.service", () => ({
  sendResetLink: jest.fn(),
}));

const bcrypt = require("bcrypt");
const userRepo = require("../src/services/user/user.repository");
const User = require("../src/services/user/user.model");
const passwordResetEmailService = require("../src/services/auth/passwordResetEmail.service");
const {
  register,
  login,
  sendPasswordResetLink,
  resetPassword,
} = require("../src/services/auth/auth.controller");

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe("password reset by email", () => {
  const originalFrontendUrl = process.env.FRONTEND_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FRONTEND_URL = "https://example.com";
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    if (originalFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = originalFrontendUrl;
    }
  });

  it("registers using a normalized Gmail address and a phone number", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByPhone.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    userRepo.getNextUserId.mockResolvedValue(13);
    userRepo.create.mockImplementation(async (user) => user);
    const res = createResponse();

    await register(
      {
        body: {
          email: " Person@gmail.com ",
          phone: "0912 345 678",
          password: "Password1!",
          full_name: "Person",
        },
      },
      res,
    );

    expect(userRepo.findByEmail).toHaveBeenCalledWith("person@gmail.com");
    expect(userRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "person@gmail.com",
        phone: "0912345678",
        email_verified: true,
        password: "hashed-password",
      }),
    );
    expect(res.statusCode).toBe(201);
  });

  it("logs in using normalized Gmail and returns the email identity", async () => {
    const user = {
      user_id: 13,
      email: "person@gmail.com",
      password: "hashed-password",
      role: "user",
      token_version: 0,
      account_status: "active",
    };
    userRepo.findByEmail.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    User.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(user) });
    const res = createResponse();

    await login(
      { body: { email: " Person@gmail.com ", password: "Password1!" } },
      res,
    );

    expect(userRepo.findByEmail).toHaveBeenCalledWith("person@gmail.com");
    expect(userRepo.updateLoginAttemptsByEmail).toHaveBeenCalledWith(
      "person@gmail.com",
      0,
      null,
    );
    expect(User.findOne).toHaveBeenCalledWith({ email: "person@gmail.com" });
    expect(res.body.user.email).toBe("person@gmail.com");
    expect(res.body.user).not.toHaveProperty("phone");
  });

  it.each(["admin", "manager", "maintenance"])(
    "logs %s in using a normalized phone number",
    async (role) => {
      const staffUser = {
        user_id: 14,
        email: "staff@gmail.com",
        phone: "0912345678",
        password: "hashed-password",
        role,
        token_version: 0,
        account_status: "active",
      };
      userRepo.findByPhone.mockResolvedValue(staffUser);
      bcrypt.compare.mockResolvedValue(true);
      User.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(staffUser) });
      const res = createResponse();

      await login(
        { body: { identifier: "+84 912 345 678", password: "Password1!" } },
        res,
      );

      expect(userRepo.findByPhone).toHaveBeenCalledWith("0912345678");
      expect(userRepo.updateLoginAttemptsByPhone).toHaveBeenCalledWith(
        "0912345678",
        0,
        null,
      );
      expect(User.findOne).toHaveBeenCalledWith({ phone: "0912345678" });
      expect(res.body.user.role).toBe(role);
    },
  );

  it("rejects phone login for a regular user", async () => {
    userRepo.findByPhone.mockResolvedValue({
      user_id: 15,
      phone: "0912345678",
      role: "user",
    });
    const res = createResponse();

    await login(
      { body: { identifier: "0912345678", password: "Password1!" } },
      res,
    );

    expect(res.statusCode).toBe(400);
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("sends a one-hour reset link and stores only the token hash", async () => {
    userRepo.findByEmail.mockResolvedValue({
      user_id: 12,
      email: "person@example.com",
    });
    User.findOneAndUpdate.mockResolvedValue({});
    passwordResetEmailService.sendResetLink.mockResolvedValue(undefined);
    const res = createResponse();

    await sendPasswordResetLink(
      { body: { email: " Person@Example.com " } },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(passwordResetEmailService.sendResetLink).toHaveBeenCalledTimes(1);
    const [, resetUrl] = passwordResetEmailService.sendResetLink.mock.calls[0];
    const token = new URL(resetUrl).searchParams.get("token");
    expect(token).toMatch(/^[a-f0-9]{64}$/);

    const [, update] = User.findOneAndUpdate.mock.calls[0];
    expect(update.reset_password_token).toBe(
      crypto.createHash("sha256").update(token).digest("hex"),
    );
    expect(update.reset_password_expires_at.getTime()).toBeGreaterThan(Date.now());
    expect(res.body.success).toBe(true);
  });

  it("changes the password only when the reset token is valid and unexpired", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.findOneAndUpdate.mockResolvedValue({ user_id: 12 });
    const res = createResponse();
    const token = "reset-token";

    await resetPassword({ body: { token, newPassword: "password1" } }, res);

    const [filter, update] = User.findOneAndUpdate.mock.calls[0];
    expect(filter.reset_password_token).toBe(
      crypto.createHash("sha256").update(token).digest("hex"),
    );
    expect(filter.reset_password_expires_at.$gt).toBeInstanceOf(Date);
    expect(update.password).toBe("hashed-password");
    expect(update.$unset.reset_password_token).toBe(1);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("rejects expired or invalid reset tokens", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");
    User.findOneAndUpdate.mockResolvedValue(null);
    const res = createResponse();

    await resetPassword(
      { body: { token: "expired-token", newPassword: "password1" } },
      res,
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("hết hạn");
  });
});
