// lib/generateCode.ts

export function generateVerificationCode(prefix: string = "FEATRRR"): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = `${prefix}-`;

  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}
