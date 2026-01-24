import "server-only"; 
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db,} from "..";
import * as schema from "../db/schema";
import { hashPassword, verifyPassword } from "@/files/Authentication/passwordHash";

export const auth = betterAuth({
  //...other options
  emailAndPassword: { 
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword
    }
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema
  }),
  
});
