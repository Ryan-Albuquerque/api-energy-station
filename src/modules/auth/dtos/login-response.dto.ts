import { z } from "zod";

export class LoginResponseDTO {
  token: string;

  private static schema = z.object({
    token: z.string(),
  });

  constructor(data: z.infer<typeof LoginResponseDTO.schema>) {
    const validatedLoginData = LoginResponseDTO.schema.safeParse(data);

    if (!validatedLoginData.success) {
      throw new Error(`Validation Error: ${validatedLoginData.error}`);
    }
    this.token = validatedLoginData.data.token;
  }
}
