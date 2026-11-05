<script lang="ts">
  let { portableText } = $props()
  const value = $derived(portableText.value)

  type Player = { kind: 'youtube' | 'soundcloud' | 'bandcamp'; src: string; height?: number }

  function toPlayer(input: string | undefined): Player | null {
    if (!input) return null
    const text = input.trim()

    // If they pasted embed code, pull out just the src and height. Never render their HTML directly.
    const src = text.match(/src=["']([^"']+)["']/)?.[1]
    const height = Number(text.match(/height[=:]\s*["']?(\d+)/)?.[1]) || undefined

    let url: URL
    try {
      url = new URL(src ?? text)
    } catch {
      return null
    }
    const host = url.hostname.replace(/^(www\.|m\.)/, '')

    // YouTube
    let id: string | null | undefined
    if (host === 'youtu.be') id = url.pathname.slice(1)
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v') ?? url.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/)?.[2]
    }
    if (id) return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` }

    // SoundCloud: normal link or embed code
    if (host === 'soundcloud.com' || host === 'on.soundcloud.com') {
      return {
        kind: 'soundcloud',
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.href)}&color=%2314528f&visual=false`,
        height: 166
      }
    }
    if (host === 'w.soundcloud.com') {
      return { kind: 'soundcloud', src: url.href, height: height ?? 166 }
    }

    // Bandcamp: embed code only
    if (host === 'bandcamp.com' && url.pathname.startsWith('/EmbeddedPlayer')) {
      return { kind: 'bandcamp', src: url.href, height: height ?? 120 }
    }

    return null
  }

  const player = $derived(toPlayer(value?.url))
</script>

{#if player}
  <figure class="embed {player.kind}">
    {#if player.kind === 'youtube'}
      <iframe
        src={player.src}
        title={value.caption ?? 'YouTube video'}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
    {:else}
      <iframe
        src={player.src}
        title={value.caption ?? `${player.kind} player`}
        style:height="{player.height}px"
        loading="lazy"
      ></iframe>
    {/if}

    {#if value.caption}
      <figcaption>{value.caption}</figcaption>
    {/if}
  </figure>
{/if}

<style>
  .embed {
    margin: 1.5em 0;
  }

  iframe {
    display: block;
    width: 100%;
    border: 0;
  }

  .youtube iframe {
    aspect-ratio: 16 / 9;
    height: auto;
  }

  figcaption {
    margin-top: 0.5em;
    font-size: 0.9em;
    opacity: 0.8;
  }
</style>