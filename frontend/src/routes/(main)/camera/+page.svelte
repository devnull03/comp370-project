<script>
  import Camera from "$lib/components/Camera.svelte";
  import { process_image } from "$lib/utils/ai.api";
  import Header from "$lib/components/Header.svelte";
  import { image, loading } from "$lib/utils/image.store";
  import { goto } from "$app/navigation";

  $: showPreview = false;
  $: capturedImageUrl = null;

  let data;

  const processCapture = async (e) => {
    $loading = true;

    capturedImageUrl = e.detail.capturedImageUrl;
    const res = await process_image(capturedImageUrl);
    data = res;

    $image = {
      url: capturedImageUrl,
      data: res,
    };
    $loading = false;
    goto("/result");
  };
</script>

<main class="w-screen h-screen bg-[#7fc7d9] px-6">
  <Header />

  <div class="rounded-[20px] border-2 border-white h-[75vh]">
    <Camera on:capture={processCapture} />
  </div>
</main>

