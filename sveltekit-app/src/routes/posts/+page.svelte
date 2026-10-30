<script>
  import { urlFor } from '$lib/sanity/image'
import {useQuery} from '@sanity/sveltekit'

let {data} = $props()
const query = $derived(useQuery(data))
const posts = $derived($query.data ?? [])
</script>

{#if posts}
<section id="posts">
  <h2>Latest</h2>
  {#each posts as post}
    <div class="post">
      <h3>{post.title}</h3>
      {#if post.mainImage}
        <img
          src={urlFor(post.mainImage).url()}
          alt={post.mainImage.alt ?? ''}
        >
      {/if}
      <p>{post.excerpt}</p>
      <a href="/posts/{post.slug.current}">Go to post</a>
    </div>
  {/each}
</section>
{/if}