<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import Upload from "../icons/Upload.svelte";

  /**
   * @type {HTMLVideoElement | null}
   */
  let videoSource = null;
  let loading = false;
  let cameraShown = false;
  let preview = false;
  let capturedImageUrl;

  const dispatch = createEventDispatcher();

  const showVideoCamera = async () => {
    const button = document.getElementById("clickButton");
    try {
      loading = true;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoSource.srcObject = stream;
      videoSource.play();
      loading = false;
      cameraShown = true;
      if (button) {
        button.style.display = "none";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const screenCapture = () => {
    if (videoSource) {
      const canvas = document.createElement("canvas");

      console.log(
        videoSource.videoWidth,
        videoSource.videoHeight,
        "size (in mb):",
        (videoSource.videoWidth * videoSource.videoHeight * 4) / 1000000
      );

      canvas.width = videoSource.videoWidth / 2;
      canvas.height = videoSource.videoHeight / 2;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(videoSource, 0, 0, canvas.width, canvas.height);
      capturedImageUrl = canvas.toDataURL("image/png");
      preview = true;

      dispatch("capture", {
        capturedImageUrl,
      });

      // Convert the canvas content to a Blob
      //   canvas.toBlob((blob) => {
      // // Create a download link
      // const link = document.createElement('a');
      // // @ts-ignore
      // link.href = URL.createObjectURL(blob);
      // link.download = 'screenshot.png';

      // // Append the link to the document and trigger a click event
      // document.body.appendChild(link);
      // link.click();

      // Remove the link from the document
      // document.body.removeChild(link);
      //   }, 'image/png');
    }
  };

  const fileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        capturedImageUrl = reader.result;
        preview = true;
        dispatch("capture", {
          capturedImageUrl,
        });
      };
    };
    input.click();
  };

  onMount(() => {
    showVideoCamera();
  });
</script>

<div class="w-full h-full object-fill overflow-clip">
  <!-- svelte-ignore a11y-media-has-caption -->
  <div class="relative overflow-clip">
    <video bind:this={videoSource} class="w-full h-screen object-cover" />
    {#if cameraShown}
      <div
        class="absolute bottom-40 flex justify-center items-end z-10 h-full w-full"
      >
        <div class="flex flex-row items-center gap-4">
          <span class="w-10">&nbsp;</span>
          <button
            class="w-20 aspect-square border-4 border-white rounded-full"
            on:click={screenCapture}>&nbsp;</button
          >
          <button class="" on:click={fileUpload}>
            <Upload />
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
