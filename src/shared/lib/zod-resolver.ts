import type { FieldError, FieldValues, Resolver } from "react-hook-form";
import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import { appendErrors } from "react-hook-form";

export interface ZodLikeSchema<TOutput = unknown> {
  parse(data: unknown, params?: unknown): TOutput;
  parseAsync(data: unknown, params?: unknown): Promise<TOutput>;
}

export interface ResolverConfig {
  mode?: "async" | "sync";
  raw?: boolean;
}

interface ZodIssueLike {
  code: string;
  message: string;
  path: (string | number)[];
  unionErrors?: { errors: ZodIssueLike[] }[];
}

function isZodIssueList(value: unknown): value is ZodIssueLike[] {
  return Array.isArray(value);
}

function parseErrors(
  errors: ZodIssueLike[],
  validateAllFieldCriteria: boolean,
): Record<string, FieldError> {
  const result: Record<string, FieldError> = {};
  const queue = [...errors];

  while (queue.length > 0) {
    const error = queue.shift();
    if (!error) break;

    const code = error.code;
    const message = error.message;
    const path = error.path.join(".");

    if (!result[path]) {
      if (error.unionErrors && error.unionErrors.length > 0 && error.unionErrors[0].errors.length > 0) {
        const u = error.unionErrors[0].errors[0];
        result[path] = { message: u.message, type: u.code };
      } else {
        result[path] = { message, type: code };
      }
    }

    if (error.unionErrors) {
      error.unionErrors.forEach((e) => {
        e.errors.forEach((nested) => queue.push(nested));
      });
    }

    if (validateAllFieldCriteria) {
      const types = result[path].types;
      const existing = types && types[code];
      result[path] = appendErrors(
        path,
        validateAllFieldCriteria,
        result,
        code,
        existing ? ([] as string[]).concat(existing as string[], message) : message,
      ) as FieldError;
    }
  }

  return result;
}

export function zodResolver<TFieldValues extends FieldValues = FieldValues>(
  schema: ZodLikeSchema<unknown>,
  schemaOptions?: unknown,
  resolverOptions: ResolverConfig = {},
): Resolver<TFieldValues> {
  return async (values, _context, options) => {
    try {
      const isSync = resolverOptions.mode === "sync";
      const parsedValues = isSync
        ? schema.parse(values, schemaOptions)
        : await schema.parseAsync(values, schemaOptions);

      if (options.shouldUseNativeValidation) {
        validateFieldsNatively({}, options);
      }

      return {
        values: (resolverOptions.raw ? values : parsedValues) as TFieldValues,
        errors: {},
      };
    } catch (error: unknown) {
      const issues =
        typeof error === "object" && error !== null
          ? (error as { issues?: unknown; errors?: unknown }).issues ??
            (error as { issues?: unknown; errors?: unknown }).errors
          : undefined;

      if (isZodIssueList(issues)) {
        return {
          values: {} as Record<string, never>,
          errors: toNestErrors(
            parseErrors(
              issues,
              !options.shouldUseNativeValidation && options.criteriaMode === "all",
            ),
            options,
          ),
        };
      }

      throw error;
    }
  };
}
