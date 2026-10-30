<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import { PortableText } from '@portabletext/svelte'
  import type {PageProps} from './$types'
  import type { HomeData } from '$lib/sanity/queries'

  import Nav from '../components/Nav.svelte';

  const {data}: PageProps = $props()
  const query = $derived(useQuery<HomeData>(data))
  const bio = $derived($query.data?.bio)
  const posts = $derived($query.data?.posts ?? [])
</script>

<div
  class="page"
>

  <Nav />

  <main>
    {#if bio?.length}
      <section id="bio">
        <h1>Flo Christman</h1>
        <PortableText value={bio} />
      </section>
    {/if}

    {#if posts}
    <section id="latest">
      <h2>Latest</h2>
      {#each posts.slice(0, 4) as post}
        <div class="post">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a href="/posts/{post.slug.current}">Go to post</a>
        </div>
      {/each}
    </section>
    {/if}
  </main>

</div>

<style>
  :global(html, body) {
    margin: 0;
  }

  .page {
    height: 100vh;
    height: 100dvh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-image: url('/flo-main.webp');
    background-size: cover;
    background-position: center;
    padding: 3%;
  }

  main {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: flex-start;
    gap: 2vw;
  }

  section {
    box-sizing: border-box;
    padding: 10px;
    background-color: rgba(255, 255, 166, 0.6);
    border-radius: 15px;
    color: #14528f;
  }

  section > a, section > .post > a {
    color: #14528f;
  }

  #bio {
    /* 15% of the screen on big displays, never narrower than 250px,
       so it takes a bigger share as the screen shrinks */
    width: max(15vw, 250px);
    max-height: 100%;
    overflow-y: auto;
  }

  #bio :global(p) {
    margin: 1vw 0;
  }

  #latest {
    width: max(30vw, 320px);
    margin-left: auto;
    align-self: flex-end;
    max-height: 100%;
    overflow-y: auto;
  }

  .post {
    margin-bottom: 10px;
  }

  /* Stack before the two sections would collide */
  @media (max-width: 700px) {
    .page {
      height: auto;
      min-height: 100vh;
      min-height: 100dvh;
    }

    main {
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start; /* stack from the top */
      gap: 20px;
    }

    #bio,
    #latest {
      width: 100%;
      max-height: none;
      overflow-y: visible;
    }

    #latest {
      margin-left: 0;
      align-self: stretch;
    }

    #bio :global(p) {
      margin: 10px 0;
    }
  }
</style>