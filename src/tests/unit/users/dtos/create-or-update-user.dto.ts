import { z } from "zod";

export class CreateOrUpdateUserDto {
  name: string;
  email: string;
  password: string;

  private static schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  constructor(user: z.infer<typeof CreateOrUpdateUserDto.schema>) {
    const validate = CreateOrUpdateUserDto.schema.safeParse(user);

    if (!validate.success) {
      throw new Error(`Validation Error: ${validate.error}`);
    }

    this.name = validate.data.name;
    this.email = validate.data.email;
    this.password = validate.data.password;
  }
}
