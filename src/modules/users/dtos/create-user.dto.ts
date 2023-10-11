import { z } from "zod";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;

  private static schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  constructor(user: z.infer<typeof CreateUserDto.schema>) {
    const validate = CreateUserDto.schema.safeParse(user);

    if (!validate.success) {
      throw new Error(`Validation Error: ${validate.error}`);
    }

    this.name = validate.data.name;
    this.email = validate.data.email;
    this.password = validate.data.password;
  }
}
