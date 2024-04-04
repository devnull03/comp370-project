<script>
  import Header from "$lib/components/Header.svelte";
  import Nav from "$lib/components/Nav.svelte";
</script>


<Header />

<div class="py-16 overflow-hidden h-screen">
  <slot />
</div>

<Nav />
