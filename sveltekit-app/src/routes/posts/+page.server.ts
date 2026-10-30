import {postsQuery, type Post} from '$lib/sanity/queries'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals}) => {
  const {loadQuery} = locals.sanity
  const initial = await loadQuery<Post[]>(postsQuery)
  return {query: postsQuery, options: {initial}}
}