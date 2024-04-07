<script>
  import Camera from "$lib/components/Camera.svelte";
  import { process_image } from "$lib/utils/ai.api";
  import Header from "$lib/components/Header.svelte";
  import { image } from "$lib/utils/image.store";
  import { goto } from "$app/navigation";

  $: showPreview = false;
  $: capturedImageUrl = null;
  $: loading = false;

  let data;

  const processCapture = async (e) => {
    loading = true;

    capturedImageUrl = e.detail.capturedImageUrl;
    const res = await process_image(capturedImageUrl);
    data = res;

    $image = {
      url: capturedImageUrl,
      data: res,
    };
    loading = false;
    goto("/result");
  };
</script>

{#if loading}
  <div
    class="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center"
    style="background: rgba(0, 0, 0, 0.3);"
  >
    <div
      class="bg-white border py-2 px-5 rounded-lg flex items-center flex-col"
    >
      <div class="loader-dots block relative w-20 h-5 mt-2">
        <div
          class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-[#7fc7d9]"
        ></div>
        <div
          class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-[#7fc7d9]"
        ></div>
        <div
          class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-[#7fc7d9]"
        ></div>
        <div
          class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-[#7fc7d9]"
        ></div>
      </div>
      <div class="text-gray-500 text-xs font-light mt-2 text-center">
        Please wait...
      </div>
    </div>
  </div>
{/if}

<main class="w-screen h-screen bg-[#7fc7d9] px-6">
  <Header />

  <div class="rounded-[20px] border-2 border-white h-[75vh]">
    <Camera on:capture={processCapture} />
  </div>
</main>

<style>
  /* Animation styling */
  .loader-dots div {
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .loader-dots div:nth-child(1) {
    left: 8px;
    animation: loader-dots1 0.6s infinite;
  }
  .loader-dots div:nth-child(2) {
    left: 8px;
    animation: loader-dots2 0.6s infinite;
  }
  .loader-dots div:nth-child(3) {
    left: 32px;
    animation: loader-dots2 0.6s infinite;
  }
  .loader-dots div:nth-child(4) {
    left: 56px;
    animation: loader-dots3 0.6s infinite;
  }
  @keyframes loader-dots1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes loader-dots3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes loader-dots2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
</style>
