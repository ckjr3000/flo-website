<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import type {PageProps} from './$types'
  import type { HomeData } from '$lib/sanity/queries'
  import {urlFor} from '$lib/sanity/image'

  const {data}: PageProps = $props()
  const query = $derived(useQuery<HomeData>(data))
  const bgImage = $derived($query.data?.backgroundImage)
  const bgUrl = $derived(
    bgImage ? urlFor(bgImage).width(1920).auto('format').url() : undefined
  )
  const bio = $derived($query.data?.bio)
  const posts = $derived($query.data?.posts ?? [])
</script>

<div
  class="page"
  style:background-image={bgUrl ? `url(${bgUrl})` : undefined}
>
  <nav>
    <a href="/">home</a>
    <a href="/posts">all posts</a>
  </nav>

  <h1>Flo Christman</h1>

  {#if bio}
  <section id="bio">
    {bio}
  </section>
  {/if}

  {#if posts}
  <section id="latest">
    <h2>Latest</h2>
    {#each posts.slice(0, 4) as post}
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <a href="/posts/{post.slug.current}">Go to post</a>
    {/each}
  </section>
  {/if}

</div>

<style>
  .page {
    min-height: 100vh;
    background-image: var(--bg);
    background-size: cover;
    background-position: center;
  }
</style>