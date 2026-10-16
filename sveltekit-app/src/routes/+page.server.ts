import {homeQuery as query, type HomeData} from '$lib/sanity/queries'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals}) => {
  const {loadQuery} = locals.sanity
  const initial = await loadQuery<HomeData>(query)
  return {query, options: {initial}}
}
