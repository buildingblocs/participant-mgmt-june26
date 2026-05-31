import { error, redirect, type RequestEvent } from "@sveltejs/kit";

export async function requireSession(event: RequestEvent) {
  const session = await event.locals.auth();

  if (!session) {
    redirect(307, "/login");
  }

  return session;
}

export async function requireOrgMember(event: RequestEvent) {
  const session = await requireSession(event);

  if (!session.isOrgMember) {
    error(403, "Forbidden");
  }

  return session;
}
