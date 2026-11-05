import { p as postsQuery } from "../../../chunks/queries.js";
const load = async ({ locals }) => {
  const { loadQuery } = locals.sanity;
  const initial = await loadQuery(postsQuery);
  return { query: postsQuery, options: { initial } };
};
export {
  load
};
