<script lang="ts">
  import { PortableText } from '@portabletext/svelte'
  import { urlFor } from '$lib/sanity/image'
  import type { PageProps } from './$types'

  import Nav from '../../../components/Nav.svelte'

  let { data }: PageProps = $props()
  const post = $derived(data.post)
</script>

<svelte:head>
  <title>{post.title} | Flo Christman</title>
  {#if post.excerpt}
    <meta name="description" content={post.excerpt} />
  {/if}
</svelte:head>

<div class="page">
  <div class="nav">
    <Nav />
  </div>

  <main>
    <div class="feature-image" aria-hidden="true"></div>

    <div class="content">
      <a class="back" href="/posts">← All posts</a>

      <article class="paper">
        <header>
          <h1>{post.title}</h1>
          <time datetime={post._createdAt}>
            {new Date(post._createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </time>
        </header>

        {#if post.mainImage}
          <img
            class="main-image"
            src={urlFor(post.mainImage).width(1200).url()}
            alt={post.mainImage.alt ?? ''}
          />
        {/if}

        {#if post.body}
          <div class="body">
            <PortableText value={post.body} />
          </div>
        {/if}
      </article>
    </div>
  </main>
</div>

<style>
  :global(html, body) {
    margin: 0;
  }

  .page {
    min-height: 100vh;
    min-height: 100dvh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: rgb(18, 77, 135);
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: rgba(18, 77, 135, 0.8);
  }

  main {
    flex: 1;
    display: flex;
    gap: 2vw;
    margin: 3%
  }

  .feature-image {
    flex: 1;
    background-image: url('/flo-alt-dithered.webp');
    background-size: 100% auto;
    background-position: top center;
    background-repeat: repeat-y;
  }

  .content {
    width: max(45vw, 320px);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .back {
    color: rgb(255, 255, 166);
    text-decoration: none;
  }

  .back:hover {
    text-decoration: underline;
  }

  article {
    box-sizing: border-box;
    padding: clamp(15px, 3vw, 40px);
    background-color: rgba(255, 255, 166, 0.7);
    border-radius: 25px;
    color: #14528f;
    line-height: 1.6;
  }

  header {
    margin-bottom: 1.5rem;
  }

  h1 {
    margin: 0 0 0.25rem;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    line-height: 1.15;
  }

  time {
    opacity: 0.8;
    font-size: 0.95rem;
  }

  .main-image {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 1.5rem;
  }

  /* Portable Text output: these elements are rendered by the component,
     so they need :global to be reached from here */
  .body {
    max-width: 65ch;          /* comfortable line length for reading */
  }

  .body :global(p) {
    margin: 0 0 1.1em;
  }

  .body :global(h2),
  .body :global(h3) {
    margin: 2em 0 0.5em;
    line-height: 1.25;
  }

  .body :global(a) {
    color: #14528f;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }

  .body :global(blockquote) {
    margin: 1.5em 0;
    padding-left: 1em;
    border-left: 4px solid #14528f;
    font-style: italic;
  }

  .body :global(ul),
  .body :global(ol) {
    padding-left: 1.25em;
    margin: 0 0 1.1em;
  }

  .body :global(li) {
    margin-bottom: 0.4em;
  }

  .body :global(img) {
    display: block;
    width: 100%;
    height: auto;
    margin: 1.5em 0;
  }

  @media (max-width: 700px) {
    main {
      flex-direction: column;
      gap: 20px;
    }

    .feature-image {
      flex: none;
      height: 35vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .content {
      width: 100%;
    }
  }
</style>