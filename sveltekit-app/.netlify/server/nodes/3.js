import * as server from '../entries/pages/posts/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/posts/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.BAOTXgjl.js","_app/immutable/chunks/CNLmREOq.js","_app/immutable/chunks/DEKRN9Qd.js","_app/immutable/chunks/BJGHUO2x.js","_app/immutable/chunks/DBlEuFIv.js","_app/immutable/chunks/CaIbXlpa.js","_app/immutable/chunks/YnajgfB_.js","_app/immutable/chunks/DdNNk13u.js","_app/immutable/chunks/DV8ff04G.js","_app/immutable/chunks/CDjaMmBz.js","_app/immutable/chunks/Bkvk2oK5.js","_app/immutable/chunks/qjRlp9Kt.js"];
export const stylesheets = ["_app/immutable/assets/Nav.fKwsDU_s.css","_app/immutable/assets/3.BFvxH8-u.css"];
export const fonts = [];
