<script lang="ts">
  import { urlFor } from '$lib/sanity/image'

  let { portableText } = $props()
  const value = $derived(portableText.value)
</script>

{#if value?.asset}
  <figure>
    <img
      src={urlFor(value).width(1200).url()}
      alt={value.alt ?? ''}
    />
    {#if value.caption}
      <figcaption>{value.caption}</figcaption>
    {/if}
  </figure>
{/if}