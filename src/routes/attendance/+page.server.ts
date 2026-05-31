import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { get, update } from "$lib/sheets";
import { env } from "$env/dynamic/private";
import { requireOrgMember } from "$lib/server/auth";

async function fetchSheetData() {
  const result = await get("physical");
  if (!result.data) {
    throw new Error("Unexpected data received");
  }
  return result;
}

export const actions = {
  markPresent: async (event) => {
    await requireOrgMember(event);
    const result = await fetchSheetData();
    const envString = env.SHEET_ENTRY_DAY || "";

    const dayRow = envString.split(",").reduce(
      (acc, letter, index) => {
        acc[String(index + 1)] = letter.trim();
        return acc;
      },
      {} as Record<string, string>,
    );
    type dayEnums = keyof typeof dayRow;

    const formData = await event.request.formData();
    const day = formData.get("day") as dayEnums;

    if (!day || !(day in dayRow)) {
      return fail(400, { errorMsg: "Something wrong bro" });
    }
    // get row num
    const index = result.data.values?.findIndex(
      (entry) => entry[0] === formData.get("id"),
    );

    if (index === undefined || index === -1) {
      return fail(400, { errorMsg: "ID not in sheet" });
    }
    // update Attendance
    try {
      await update(dayRow[day] + (index! + 1));
      // return fail(400, { errorMsg: "ID not in sheet" });
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(502, { errorMsg: String(e) });
    }
  },
  comment: async (event) => {
    await requireOrgMember(event);
    const col = env.SHEET_INFO_COMMENT_COL || "";
    const result = await fetchSheetData();
    const formData = await event.request.formData();
    const comment = formData.get("comment");
    const id = formData.get("id");

    if (typeof comment === "string" && id) {
      try {
        // get index
        const index = result.data.values?.findIndex((entry) => entry[0] === id);

        if (index === undefined || index === -1) {
          return fail(400, { errorMsg: "ID not in sheet" });
        }
        await update(col + (index + 1), comment);
        // return fail(400, { errorMsg: "ID not in sheet" });
        return { success: true };
      } catch (e) {
        console.error(e);
        return fail(502, { errorMsg: String(e) });
      }
    } else {
      return fail(400, { errorMsg: "Missing comment or ID parameter" });
    }
  },
} satisfies Actions;

export const load: PageServerLoad = async (event) => {
  await requireOrgMember(event);
  const result = await fetchSheetData();
  return {
    ids: result.data.values ?? [],
    header: {
      heading: "Attendance",
      back: true,
    },
  };
};
