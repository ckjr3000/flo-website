import { error } from "@sveltejs/kit";
import { c as client } from "../../../../chunks/client.js";
import { a as postQuery } from "../../../../chunks/queries.js";
const load = async ({ params }) => {
  const post = await client.fetch(postQuery, { slug: params.slug });
  if (!post) {
    error(404, "Post not found");
  }
  return { post };
};
export {
  load
};
