<script>
  import Header from "$lib/components/Header.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { image } from "$lib/utils/image.store";

  let firstLoad = true;

  onMount(() => {
    if (!$image) {
      goto("/camera");
    }

    if (firstLoad) {
      setTimeout(() => {
        firstLoad = false;
      }, 1500);
    }
  });
</script>

{#if firstLoad}
  <main class="h-screen w-screen flex items-center justify-center bg-[#7fc7d9]">
    <div class="flex flex-col items-center">
      <img src="/favicon.png" alt="Logo" class="w-20 h-20 animate-bounce" />
      <span class="text-2xl font-lemon"> Waste Wizard </span>
    </div>
  </main>
{:else}
  <!-- <Header /> -->

  <!-- <div class="pt-16 overflow-hidden h-screen"> -->
  <slot />
  <!-- </div> -->
{/if}
