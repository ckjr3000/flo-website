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

<div class="page">

  <Nav />

  <main>
    {#if bio?.length}
      <section class="paper" id="bio">
        <h1>Flo Christman</h1>
        <PortableText value={bio} />
      </section>
    {/if}

    {#if posts.length}
    <section class="paper" id="latest">
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
  }

  .page::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    opacity: 0.15;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
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
    padding: 15px;
    background-color: rgba(255, 255, 166, 0.6);
    border-radius: 15px;
    color: #14528f;
    margin: 3%;
  }

  section > a, section > .post > a {
    color: #14528f;
  }

  /* --- Bio: flows down, then wraps into new columns to the right --- */
  #bio {
    writing-mode: vertical-lr;      /* flips the box so it grows sideways */
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    max-height: calc(100% - 6vw);   /* full height minus the section's top/bottom margin */
    max-width: 25vw;                /* stops it crowding out Latest */
  }

  #bio > :global(*) {
    writing-mode: horizontal-tb;    /* text inside reads normally */
    width: 30ch;                    /* column width */
    margin: 0 2rem 0.8em 0;         /* space below each paragraph and between columns */
  }

  #bio h1 {
    font-size: 3rem;
    margin-bottom: 0.3em;
  }

  /* --- Latest --- */
  #latest {
    width: max(30vw, 320px);
    margin-left: auto;
    align-self: flex-end;
    max-height: calc(100% - 6vw);
    overflow-y: auto;
  }

  .post {
    margin-bottom: 10px;
  }

  @media (max-width: 700px) {
    .page {
      height: auto;
      min-height: 100vh;
      min-height: 100dvh;
    }

    main {
      flex-direction: column;
      align-items: stretch;
      gap: 20px;
    }

    #bio {
      writing-mode: horizontal-tb;  /* back to a normal block on phones */
      display: block;
      max-height: none;
      max-width: none;
    }

    #bio > :global(*) {
      width: auto;
      margin: 0 0 0.8em;
    }

    #latest {
      width: auto;
      max-height: none;
      overflow-y: visible;
      margin-left: 3%;
      align-self: stretch;
    }
  }
</style>