import { z } from "zod";

export class LoginRequestDTO {
  email: string;
  password: string;

  private static schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  constructor(data: z.infer<typeof LoginRequestDTO.schema>) {
    const validatedLoginData = LoginRequestDTO.schema.safeParse(data);

    if (!validatedLoginData.success) {
      throw new Error(`Validation Error: ${validatedLoginData.error}`);
    }
    (this.email = validatedLoginData.data.email),
      (this.password = validatedLoginData.data.password);
  }
}
