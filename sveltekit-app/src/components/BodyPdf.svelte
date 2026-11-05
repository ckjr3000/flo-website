<script lang="ts">
  let { portableText } = $props()
  const value = $derived(portableText.value)
</script>

{#if value?.url}
  <p>
    <a href={value.url} target="_blank" rel="noopener">
      {value.title || value.filename || 'Download PDF'}
    </a>
  </p>
{/if}