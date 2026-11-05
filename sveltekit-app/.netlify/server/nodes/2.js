import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.CR4gqRlR.js","_app/immutable/chunks/CNLmREOq.js","_app/immutable/chunks/DEKRN9Qd.js","_app/immutable/chunks/BJGHUO2x.js","_app/immutable/chunks/DBlEuFIv.js","_app/immutable/chunks/CaIbXlpa.js","_app/immutable/chunks/YnajgfB_.js","_app/immutable/chunks/DdNNk13u.js","_app/immutable/chunks/Do24u8Cn.js","_app/immutable/chunks/B3_8P8od.js","_app/immutable/chunks/PIRrwEms.js","_app/immutable/chunks/Bkvk2oK5.js","_app/immutable/chunks/CqkleIqs.js","_app/immutable/chunks/qjRlp9Kt.js"];
export const stylesheets = ["_app/immutable/assets/Nav.fKwsDU_s.css","_app/immutable/assets/2.B1QPwqKH.css"];
export const fonts = [];
