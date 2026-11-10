import { z } from "zod";
import { siteConfig } from "@/config/site.config";

const minPassLength = siteConfig.auth.passwordRules.minLength;

export const strongPasswordValidation = z
  .string()
  .min(minPassLength, `Пароль должен содержать не менее ${minPassLength} символов`)
  .regex(/[a-zа-яё]/, "Пароль должен содержать хотя бы одну строчную букву")
  .regex(/[A-ZА-ЯЁ]/, "Пароль должен содержать хотя бы одну заглавную букву")
  .regex(/\d/, "Пароль должен содержать хотя бы одну цифру")
  .regex(
    /[^a-zA-Z0-9а-яА-ЯёЁ\s]/,
    "Пароль должен содержать хотя бы один специальный символ (например, !@#$%^&*)",
  );

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Поле «Логин» обязательно для заполнения"),
  password: z
    .string()
    .min(1, "Поле «Пароль» обязательно для заполнения"),
  captchaVerified: z
    .boolean()
    .refine((val) => val === true, "Пожалуйста, соберите пазл капчи перед отправкой"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    login: z
      .string()
      .min(1, "Поле «Логин» обязательно для заполнения")
      .min(3, "Логин должен содержать не менее 3 символов")
      .regex(/^[a-zA-Z0-9_-]+$/, "Логин может содержать только латинские буквы, цифры, дефис и подчёркивание"),
    name: z
      .string()
      .min(1, "Поле «Имя» обязательно для заполнения")
      .min(2, "Имя должно содержать не менее 2 символов"),
    email: z
      .string()
      .email("Некорректный формат email")
      .optional()
      .or(z.literal("")),
    password: strongPasswordValidation,
    confirmPassword: z
      .string()
      .min(1, "Подтвердите пароль"),
    captchaVerified: z
      .boolean()
      .refine((val) => val === true, "Пожалуйста, соберите пазл капчи перед отправкой"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Введите текущий пароль"),
    newPassword: strongPasswordValidation,
    confirmNewPassword: z
      .string()
      .min(1, "Подтвердите новый пароль"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Новые пароли не совпадают",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const USER_ROLES = [siteConfig.roles.admin, siteConfig.roles.user] as const;

export const adminCreateUserSchema = z.object({
  login: z
    .string()
    .min(1, "Логин обязателен")
    .min(3, "Минимум 3 символа")
    .regex(/^[a-zA-Z0-9_-]+$/, "Латинские буквы, цифры, дефис и подчёркивание"),
  name: z
    .string()
    .min(1, "Имя обязательно"),
  password: strongPasswordValidation,
  role: z.enum(USER_ROLES),
});

export type AdminCreateUserFormValues = z.infer<typeof adminCreateUserSchema>;

export const adminUpdateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .max(100, "Имя не должно превышать 100 символов"),
  role: z.enum(USER_ROLES),
  isBlocked: z.boolean(),
  password: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type AdminUpdateUserFormValues = z.infer<typeof adminUpdateUserSchema>;
