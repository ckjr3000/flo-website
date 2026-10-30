<script lang="ts">
  import { urlFor } from '$lib/sanity/image'
  import { useQuery } from '@sanity/sveltekit'
  import type { Post } from '$lib/sanity/queries'

  import Nav from '../../components/Nav.svelte'

  let { data } = $props()
  const query = $derived(useQuery<Post[]>(data))
  const posts = $derived($query.data ?? [])
</script>

<div class="page">
  <div class="nav">
    <Nav />
  </div>

  <main>
    <div class="feature-image" aria-hidden="true"></div>

    {#if posts.length}
      <section id="posts">
        <h2>All Posts</h2>
        {#each posts as post}
          <div class="post paper">
            <h3>{post.title}</h3>
            {#if post.mainImage}
              <img
                src={urlFor(post.mainImage).width(900).url()}
                alt={post.mainImage.alt ?? ''}
              />
            {/if}
            {#if post.excerpt}
              <p>{post.excerpt}</p>
            {/if}
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
    padding: 3%;      
  }

  .feature-image {
    flex: 1;
    background-image: url('/flo-alt-dithered.webp');
    background-size: 100% auto;    
    background-position: top center;
    background-repeat: repeat-y;   
  }

  #posts {
    width: max(45vw, 320px);
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  #posts h2 {
    margin: 0;
    color: rgb(255, 255, 166);
  }

  .post {
    box-sizing: border-box;
    padding: 15px;
    background-color: rgba(255, 255, 166, 0.7);
    border-radius: 25px;
    color: #14528f;
  }

  .post h3 {
    margin-top: 0;
  }

  .post a {
    color: #14528f;
  }

  .post img {
    display: block;
    width: 100%;
    height: auto;
    margin: 15px 0;
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

    #posts {
      width: 100%;
    }
  }
</style>