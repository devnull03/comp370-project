<script>
  import XCircle from "$lib/icons/XCircle.svelte";
  import { createEventDispatcher } from "svelte";

  export let capturedImageUrl;
  export let data;

  const binMap = {
    R: "Recycling",
    O: "Compost",
    L: "Landfill",
  };

  let imgElement;

  const dispatch = createEventDispatcher();
</script>

<div
  class="bg-white rounded-lg shadow-lg h-[80vh] w-full mx-4 flex flex-col justify-between p-4"
>
  <div class="w-full flex items-center justify-center">
    {#key capturedImageUrl}
      <img
        src={capturedImageUrl}
        alt="previewImage"
        class="rounded-full w-[80%] aspect-square object-cover"
        bind:this={imgElement}
      />
    {/key}
  </div>

  {#if data.bin === "X"}
    <div class="w-full flex items-center justify-center text-2xl text-center">
      Could not identify object as trash. <br /> Please try again.
    </div>
  {:else}
    <div
      class="flex flex-col items-center text-[#1B4967] text-lg w-full px-2 text-left"
    >
      <p class="flex flex-row justify-between w-full">
        <span class="max-w-[75%] break-words">{data.label}</span>
        <!-- <span class="">{data.pts}pts</span> -->
      </p>
      <p class="w-full">{binMap[data.bin]}</p>
      <p class="w-full">{data.fact}</p>
    </div>
  {/if}

  <div>
    <button
      class="w-full flex items-center justify-center"
      on:click={() => {
        dispatch("close");
      }}
    >
      <XCircle />
    </button>
  </div>
</div>
