<script lang="ts">
    import { SignOut } from "@auth/sveltekit/components";
    import type { Session } from "@auth/sveltekit";
    import Back from "$lib/components/back.svelte";
    import Exit from "$lib/components/icons/exit.svelte";

    type HeaderData = {
        header?: {
            back?: boolean;
            heading?: string;
            info?: unknown;
        };
        session?: Session | null;
    };

    let { data }: { data: HeaderData } = $props();

    const headingLines = $derived((data.header?.heading ?? "").split("<br>"));
</script>

<div
    class="bg-blue-950 text-white flex flex-col h-40 min-h-40 justify-between p-5 max-w-md w-full mx-auto"
>
    {#if data.header?.back}
        <div class="flex items-center justify-between">
            <Back />
        </div>
    {:else if data.header?.info == null && data.session}
        <div class="flex items-center justify-between w-full">
            <p class="text-sm tracking-tight text-blue-100">
                Logged in as {data.session.user?.name ?? "Unknown user"}
            </p>
            <SignOut signOutPage="logout">
                <div slot="submitButton">
                    <Exit />
                </div>
            </SignOut>
        </div>
    {:else}
        <div class="flex items-center justify-between w-full">
            <p class="text-sm tracking-tight text-blue-100">
                BuildingBloCS June Jam 2026
            </p>
        </div>
    {/if}

    <h1 class="text-xl font-bold">
        {#each headingLines as line, index (index)}
            {#if index > 0}<br />{/if}{line}
        {/each}
    </h1>
</div>
