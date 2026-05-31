// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { DefaultSession } from "@auth/core/types";

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module "@auth/core/types" {
  interface Session {
    user?: DefaultSession["user"];
    isOrgMember?: boolean;
  }
}

declare module "@auth/sveltekit" {
  interface Session {
    user?: DefaultSession["user"];
    isOrgMember?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    isOrgMember?: boolean;
  }
}

export {};
