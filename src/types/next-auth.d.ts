/**
 * Расширение типов NextAuth для добавления дополнительных полей в Session и JWT
 */

import { DefaultSession } from "next-auth";
import { AuthMethod } from "@/entities/user/model/types";

declare module "next-auth" {
  /**
   * Расширение интерфейса Session
   */
  interface Session {
    user: {
      id: string;
      emailVerified?: boolean;
      authMethod?: AuthMethod;
    } & DefaultSession["user"];
  }

  /**
   * Расширение интерфейса User
   */
  interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    authMethod: AuthMethod;
  }
}

declare module "next-auth/jwt" {
  /**
   * Расширение интерфейса JWT
   */
  interface JWT {
    userId?: string;
    emailVerified?: boolean;
    authMethod?: AuthMethod;
  }
}
