import { a as ensure_array_like, e as escape_html, b as attr, c as stringify, d as derived, f as store_get, u as unsubscribe_stores } from "../../chunks/index.js";
import { P as PortableText } from "../../chunks/PortableText.js";
import { N as Nav } from "../../chunks/Nav.js";
import { a as useQuery } from "../../chunks/createQueryStore.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const { data } = $$props;
    const query = derived(() => useQuery(data));
    const bio = derived(() => store_get($$store_subs ??= {}, "$query", query()).data?.bio);
    const posts = derived(() => store_get($$store_subs ??= {}, "$query", query()).data?.posts ?? []);
    $$renderer2.push(`<div class="page svelte-1uha8ag">`);
    Nav($$renderer2);
    $$renderer2.push(`<!----> <main class="svelte-1uha8ag">`);
    if (bio()?.length) {
      $$renderer2.push(`<!--[0--><section class="paper svelte-1uha8ag" id="bio"><h1 class="svelte-1uha8ag">Flo Christman</h1> `);
      PortableText($$renderer2, { value: bio() });
      $$renderer2.push(`<!----></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (posts().length) {
      $$renderer2.push(`<!--[0--><section class="paper svelte-1uha8ag" id="latest"><h2>Latest</h2> <!--[-->`);
      const each_array = ensure_array_like(posts().slice(0, 4));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let post = each_array[$$index];
        $$renderer2.push(`<div class="post svelte-1uha8ag"><h3>${escape_html(post.title)}</h3> <p>${escape_html(post.excerpt)}</p> <a${attr("href", `/posts/${stringify(post.slug.current)}`)} class="svelte-1uha8ag">Go to post</a></div>`);
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
