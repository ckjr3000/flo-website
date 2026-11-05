import { b as attr, e as escape_html, d as derived, h as attr_class, c as stringify, j as attr_style, k as head } from "../../../../chunks/index.js";
import { P as PortableText } from "../../../../chunks/PortableText.js";
import { u as urlFor } from "../../../../chunks/image.js";
import { N as Nav } from "../../../../chunks/Nav.js";
function BodyImage($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { portableText } = $$props;
    const value = derived(() => portableText.value);
    if (value()?.asset) {
      $$renderer2.push(`<!--[0--><figure><img${attr("src", urlFor(value()).width(1200).url())}${attr("alt", value().alt ?? "")}/> `);
      if (value().caption) {
        $$renderer2.push(`<!--[0--><figcaption>${escape_html(value().caption)}</figcaption>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></figure>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function BodyPdf($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { portableText } = $$props;
    const value = derived(() => portableText.value);
    if (value()?.url) {
      $$renderer2.push(`<!--[0--><p><a${attr("href", value().url)} target="_blank" rel="noopener">${escape_html(value().title || value().filename || "Download PDF")}</a></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function BodyEmbed($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { portableText } = $$props;
    const value = derived(() => portableText.value);
    function toPlayer(input) {
      if (!input) return null;
      const text = input.trim();
      const src = text.match(/src=["']([^"']+)["']/)?.[1];
      const height = Number(text.match(/height[=:]\s*["']?(\d+)/)?.[1]) || void 0;
      let url;
      try {
        url = new URL(src ?? text);
      } catch {
        return null;
      }
      const host = url.hostname.replace(/^(www\.|m\.)/, "");
      let id;
      if (host === "youtu.be") id = url.pathname.slice(1);
      if (host === "youtube.com" || host === "youtube-nocookie.com") {
        id = url.searchParams.get("v") ?? url.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/)?.[2];
      }
      if (id) return {
        kind: "youtube",
        src: `https://www.youtube-nocookie.com/embed/${id}`
      };
      if (host === "soundcloud.com" || host === "on.soundcloud.com") {
        return {
          kind: "soundcloud",
          src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.href)}&color=%2314528f&visual=false`,
          height: 166
        };
      }
      if (host === "w.soundcloud.com") {
        return { kind: "soundcloud", src: url.href, height: height ?? 166 };
      }
      if (host === "bandcamp.com" && url.pathname.startsWith("/EmbeddedPlayer")) {
        return { kind: "bandcamp", src: url.href, height: height ?? 120 };
      }
      return null;
    }
    const player = derived(() => toPlayer(value()?.url));
    if (player()) {
      $$renderer2.push(`<!--[0--><figure${attr_class(`embed ${stringify(player().kind)}`, "svelte-1viubi1")}>`);
      if (player().kind === "youtube") {
        $$renderer2.push(`<!--[0--><iframe${attr("src", player().src)}${attr("title", value().caption ?? "YouTube video")} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" loading="lazy" class="svelte-1viubi1"></iframe>`);
      } else {
        $$renderer2.push(`<!--[-1--><iframe${attr("src", player().src)}${attr("title", value().caption ?? `${player().kind} player`)} loading="lazy" class="svelte-1viubi1"${attr_style("", { height: `${stringify(player().height)}px` })}></iframe>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (value().caption) {
        $$renderer2.push(`<!--[0--><figcaption class="svelte-1viubi1">${escape_html(value().caption)}</figcaption>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></figure>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const post = derived(() => data.post);
    head("14u6r3i", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(post().title)} | Flo Christman</title>`);
      });
      if (post().excerpt) {
        $$renderer3.push(`<!--[0--><meta name="description"${attr("content", post().excerpt)}/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`<div class="page svelte-14u6r3i"><div class="nav svelte-14u6r3i">`);
    Nav($$renderer2);
    $$renderer2.push(`<!----></div> <main class="svelte-14u6r3i"><div class="feature-image svelte-14u6r3i" aria-hidden="true"></div> <div class="content svelte-14u6r3i"><a class="back svelte-14u6r3i" href="/posts">← All posts</a> <article class="paper svelte-14u6r3i"><header class="svelte-14u6r3i"><h1 class="svelte-14u6r3i">${escape_html(post().title)}</h1> <time${attr("datetime", post()._createdAt)} class="svelte-14u6r3i">${escape_html(new Date(post()._createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }))}</time></header> `);
    if (post().mainImage) {
      $$renderer2.push(`<!--[0--><img class="main-image svelte-14u6r3i"${attr("src", urlFor(post().mainImage).width(1200).url())}${attr("alt", post().mainImage.alt ?? "")}/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (post().body) {
      $$renderer2.push(`<!--[0--><div class="body svelte-14u6r3i">`);
      PortableText($$renderer2, {
        value: post().body,
        components: { types: { image: BodyImage, pdf: BodyPdf, embed: BodyEmbed } }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></article></div></main></div>`);
  });
}
export {
  _page as default
};
