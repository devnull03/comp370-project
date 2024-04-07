<script>
  import { goto } from "$app/navigation";
  import Eco from "$lib/icons/Eco.svelte";
  import Logo from "../../lib/icons/logo.svelte";
</script>

<main
  class="bg-[#7fc7d9] h-screen w-screen flex flex-col items-center justify-center text-[#0F1035] px-10"
>
  <div class="text-[#0F1035] text-2xl">
    Your small effort can make a huge diference
  </div>
  <div class="text-[#0F1035] text-opacity-60 mt-6 text-sm">
    Click a picture of your product get all the information you need to know to
    properly dispose it....
  </div>
  <Eco />
  <button
    on:click={() => goto("/camera")}
    class="rounded-full text-white bg-[#0F1035] flex text-xl p-3 px-8 gap-4 shadow"
  >
    Start
    <Logo size="24" color="white" />
  </button>
</main>
