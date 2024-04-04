<script>
  import User from "$lib/icons/User.svelte";
  import { goto } from "$app/navigation";
  import Plant from "$lib/icons/Plant.svelte";
</script>

<header class="border-b shadow-md fixed top-0 w-full bg-[#7fc7d9] p-4 z-50">
  <div class="flex flex-row w-full justify-between items-center">
    <!-- <Plant /> -->
    <img src="/favicon.png" alt="logo" class="w-12 h-12" />
    <span class="text-xl font-lemon"> Waste Wizard </span>
  </div>
</header>
