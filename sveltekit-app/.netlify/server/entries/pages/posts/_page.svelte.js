import { a as ensure_array_like, e as escape_html, b as attr, c as stringify, d as derived, f as store_get, u as unsubscribe_stores } from "../../../chunks/index.js";
import { u as urlFor } from "../../../chunks/image.js";
import { N as Nav } from "../../../chunks/Nav.js";
import { a as useQuery } from "../../../chunks/createQueryStore.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    const query = derived(() => useQuery(data));
    const posts = derived(() => store_get($$store_subs ??= {}, "$query", query()).data ?? []);
    $$renderer2.push(`<div class="page svelte-lvfn04"><div class="nav svelte-lvfn04">`);
    Nav($$renderer2);
    $$renderer2.push(`<!----></div> <main class="svelte-lvfn04"><div class="feature-image svelte-lvfn04" aria-hidden="true"></div> `);
    if (posts().length) {
      $$renderer2.push(`<!--[0--><section id="posts" class="svelte-lvfn04"><h2 class="svelte-lvfn04">All Posts</h2> <!--[-->`);
      const each_array = ensure_array_like(posts());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let post = each_array[$$index];
        $$renderer2.push(`<div class="post paper svelte-lvfn04"><h3 class="svelte-lvfn04">${escape_html(post.title)}</h3> `);
        if (post.mainImage) {
          $$renderer2.push(`<!--[0--><img${attr("src", urlFor(post.mainImage).width(900).url())}${attr("alt", post.mainImage.alt ?? "")} class="svelte-lvfn04"/>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (post.excerpt) {
          $$renderer2.push(`<!--[0--><p>${escape_html(post.excerpt)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <a${attr("href", `/posts/${stringify(post.slug.current)}`)} class="svelte-lvfn04">Go to post</a></div>`);
      }
      $$renderer2.push(`<!--]--></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
