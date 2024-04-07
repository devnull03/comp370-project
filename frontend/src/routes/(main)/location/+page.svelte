<script>
  import Header from "$lib/components/Header.svelte";
  import LocSvg from "$lib/icons/LocSvg.svelte";
  import { image, loading, places } from "$lib/utils/image.store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { get_locations } from "$lib/utils/ai.api";

  const binMap = {
    R: "Recycling",
    O: "Compost",
    L: "Landfill",
  };

  onMount(async () => {
    if (!$image) {
      goto("/camera");
    }

    $loading = true;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const res = await get_locations(
        binMap[$image.data.bin],
        $image.data.label,
        position.coords
      );
      $places = res.places;
      console.log(res);
      $loading = false;
    });
  });
</script>

<main class="w-screen h-screen bg-[#7fc7d9] px-6 flex flex-col pb-4">
  <Header />

  <div class="overflow-auto">
    <div class="w-full flex justify-center mb-10">
      <LocSvg />
    </div>

    <div class="flex flex-col gap-4">
      <div class="text-2xl mt-2">Locations:</div>

      {#each $places as place}
        <div
          class="bg-[#D9D9D9] rounded-lg flex gap-2 justify-between p-4 items-center"
        >
          <div class="flex flex-col">
            <span class="">{place.displayName.text}</span>
            <span class="text-xs text-black text-opacity-70"
              >{place.formattedAddress}</span
            >
          </div>
          <a
            class="rounded-lg text-white bg-[#0F1035] flex text-sm p-4 py-2 gap-4 shadow-lg"
            href={place.googleMapsUri}
          >
            Go
          </a>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-3 justify-center items-center py-4">
    <button
      on:click={() => goto("/camera")}
      class="rounded-full text-white bg-[#0F1035] flex text-xl p-3 px-8 gap-4 shadow-lg"
    >
      Start Over
    </button>
  </div>
</main>
