import { h as homeQuery } from "../../chunks/queries.js";
const load = async ({ locals }) => {
  const { loadQuery } = locals.sanity;
  const initial = await loadQuery(homeQuery);
  return { query: homeQuery, options: { initial } };
};
export {
  load
};
