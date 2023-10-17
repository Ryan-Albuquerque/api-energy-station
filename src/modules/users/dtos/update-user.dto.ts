import { z } from "zod";

export class UpdateUserDto {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;

  private static schema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  });

  constructor(user: z.infer<typeof UpdateUserDto.schema>) {
    const validate = UpdateUserDto.schema.safeParse(user);

    if (!validate.success) {
      throw new Error(`Validation Error: ${validate.error}`);
    }

    this.name = validate.data.name;
    this.email = validate.data.email;
    this.password = validate.data.password;
  }
}
