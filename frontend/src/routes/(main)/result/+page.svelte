<script>
  import Header from "$lib/components/Header.svelte";
  import { image } from "$lib/utils/image.store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const binMap = {
    R: "Recycling",
    O: "Compost",
    L: "Landfill",
  };

  // test data
  // $image = {
  //   url: "https://via.placeholder.com/500",
  //   data: {
  //     label: "Plastic Bottle",
  //     bin: "R",
  //     fact: "Plastic bottles are recyclable.",
  //   },
  // };

  onMount(() => {
    if (!$image) {
      goto("/camera");
    }
  });
</script>

<main class="w-screen h-screen bg-[#7fc7d9] px-6 flex flex-col gap-10 overflow-auto">
  <Header />

  <div
    class="relative rounded-[20px] object-cover border-[6px] border-white h-[40vh] shadow flex justify-center"
  >
    <img
      src={$image.url}
      alt=""
      class="h-full w-full object-cover rounded-[20px]"
    />

    <div
      class="absolute -bottom-6 rounded-full text-black text-opacity-70 bg-white flex p-2 px-6 gap-4"
    >
      {binMap[$image.data.bin]}
    </div>
  </div>

  <div>
    <div class="text-2xl mt-2">
      {$image.data.label}
    </div>
    <div class="text-black text-opacity-70">
      {$image.data.fact}
    </div>
  </div>

  <div class="flex flex-col gap-3 justify-center items-center">
    {#if ["R", "O", "L"].includes($image.data.bin)}
      <button
        on:click={() => goto("/location")}
        class="rounded-full text-white bg-[#0F1035] flex text-xl p-3 px-8 gap-4 shadow-lg"
      >
        Disposal locations
      </button>
    {/if}
    <button
      on:click={() => goto("/camera")}
      class="text-[#0F1035] text-opacity-[47%]">Start Over</button
    >
  </div>
</main>
