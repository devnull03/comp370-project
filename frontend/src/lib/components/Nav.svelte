<script>
  import Camera from "$lib/icons/Camera.svelte";
  import Gallery from "$lib/icons/Gallery.svelte";
  import Glossary from "$lib/icons/Glossary.svelte";
  import Leaderboard from "$lib/icons/Leaderboard.svelte";
  import { galleryBounce } from "$lib/utils/nav.store";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let navItems = [
    {
      path: "/",
      name: "Camera",
      icon: Camera,
    },
  ];
</script>

<nav class="border-t shadow-md fixed bottom-0 w-screen bg-[#7fc7d9] pb-8 pt-4 z-50">
  <div class="flex flex-row w-full justify-evenly items-baseline">
    {#each navItems as navItem}
      <button
        class="transition duration-150 ease-in-out"
        class:scale-150={navItem.path === $page.url.pathname}
        class:animate-bounce={navItem.path === "/gallery" && $galleryBounce}
        on:click={() => goto(navItem.path)}
      >
        <svelte:component this={navItem.icon} />
      </button>
    {/each}
  </div>
</nav>
