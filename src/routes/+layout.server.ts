import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { requireSession } from "$lib/server/auth";

export const load: LayoutServerLoad = async (event) => {
  let session;

  if (event.url.pathname == "/login") {
    session = await event.locals.auth();
  } else {
    session = await requireSession(event);
  }

  if (session != null && event.url.pathname == "/login") {
    redirect(307, "/");
  }

  return {
    session,
  };
};
