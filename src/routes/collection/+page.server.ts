import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { requireOrgMember } from "$lib/server/auth";

export const actions = {
  markPresent: async (event) => {
    await requireOrgMember(event);

    return fail(410, {
      errorMsg: "Freebie collection is not in use",
    });
  },
} satisfies Actions;

export const load: PageServerLoad = async (event) => {
  await requireOrgMember(event);

  return {
    header: {
      heading: "Freebie<br>Collection",
      back: true,
    },
  };
};
