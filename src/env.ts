import { createEnv } from "@t3-env/core";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "production"]),
  },
  runtimeEnv: process.env,
}); 