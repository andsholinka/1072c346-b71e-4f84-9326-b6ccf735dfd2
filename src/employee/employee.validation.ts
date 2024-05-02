import { z, ZodType } from 'zod';

export class EmployeeValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(1).max(100),
        last_name: z.string().min(1).max(100),
        position: z.string().min(1).max(100),
        phone: z.string().min(1).max(100),
        email: z.string().min(1).max(100).email(),
    });

    static readonly UPDATE: ZodType = z.object({
        first_name: z.string().min(1).max(100).optional(),
        last_name: z.string().min(1).max(100).optional(),
        position: z.string().min(1).max(100).optional(),
        phone: z.string().min(1).max(100).optional(),
        email: z.string().min(1).max(100).email().optional(),
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).optional(),
        page: z.number().min(1).positive().optional(),
        size: z.number().min(1).max(100).positive().optional(),
    });
}
