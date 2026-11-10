import { z } from "zod";

const currentYear = new Date().getFullYear();

export const movieFormSchema = z.object({
  title: z
    .string()
    .min(1, "Название фильма обязательно для заполнения")
    .max(255, "Название не должно превышать 255 символов"),
  originalTitle: z
    .string()
    .max(255, "Оригинальное название не должно превышать 255 символов")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, "Описание должно содержать не менее 10 символов"),
  year: z.coerce
    .number()
    .int("Год должен быть целым числом")
    .min(1895, "Год не может быть ранее 1895")
    .max(currentYear + 5, `Год не может быть позднее ${currentYear + 5}`),
  director: z
    .string()
    .min(1, "Имя режиссёра обязательно для заполнения")
    .max(255, "Имя режиссёра не должно превышать 255 символов"),
  genres: z
    .string()
    .min(1, "Укажите хотя бы один жанр (через запятую)"),
  country: z
    .string()
    .max(100, "Название страны не должно превышать 100 символов")
    .optional()
    .or(z.literal("")),
  durationMinutes: z.coerce
    .number()
    .int("Длительность должна быть целым числом")
    .min(1, "Длительность должна быть не менее 1 минуты")
    .max(1000, "Длительность не может превышать 1000 минут"),
  rating: z.coerce
    .number()
    .min(0.0, "Рейтинг не может быть меньше 0.0")
    .max(10.0, "Рейтинг не может превышать 10.0"),
  ageRating: z
    .string()
    .min(1, "Выберите или укажите возрастной рейтинг"),
  posterUrl: z
    .string()
    .url("Введите корректную ссылку на изображение постера")
    .optional()
    .or(z.literal("")),
});

export type MovieFormValues = z.infer<typeof movieFormSchema>;

export const DEFAULT_MOVIE_FORM_VALUES: MovieFormValues = {
  title: "",
  originalTitle: "",
  description: "",
  year: currentYear,
  director: "",
  genres: "",
  country: "",
  durationMinutes: 120,
  rating: 7.5,
  ageRating: "16+",
  posterUrl: "",
};
