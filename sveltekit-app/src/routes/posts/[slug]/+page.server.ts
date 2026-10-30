import { error } from '@sveltejs/kit'
import { client } from '$lib/sanity/client'
import { postQuery, type Post } from '$lib/sanity/queries'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const post = await client.fetch<Post | null>(postQuery, { slug: params.slug })

  if (!post) {
    error(404, 'Post not found')
  }

  return { post }
}