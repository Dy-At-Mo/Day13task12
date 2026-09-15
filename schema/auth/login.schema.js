import z, { email } from "zod"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})
