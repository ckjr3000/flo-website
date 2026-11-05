import { init } from '../serverless.js';

export default init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","flo-alt-dithered.webp","flo-main.webp","global.css"]),
	mimeTypes: {".webp":"image/webp",".css":"text/css"},
	_: {
		client: {start:"_app/immutable/entry/start.DRRugoBn.js",app:"_app/immutable/entry/app.CzN0Tk2-.js",imports:["_app/immutable/entry/start.DRRugoBn.js","_app/immutable/chunks/DEKRN9Qd.js","_app/immutable/chunks/YnajgfB_.js","_app/immutable/chunks/D57a6L_J.js","_app/immutable/chunks/qjRlp9Kt.js","_app/immutable/entry/app.CzN0Tk2-.js","_app/immutable/chunks/DBlEuFIv.js","_app/immutable/chunks/DEKRN9Qd.js","_app/immutable/chunks/CaIbXlpa.js","_app/immutable/chunks/YnajgfB_.js","_app/immutable/chunks/BJGHUO2x.js","_app/immutable/chunks/CNLmREOq.js","_app/immutable/chunks/qjRlp9Kt.js","_app/immutable/chunks/B3_8P8od.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../server/nodes/0.js')),
			__memo(() => import('../server/nodes/1.js')),
			__memo(() => import('../server/nodes/2.js')),
			__memo(() => import('../server/nodes/3.js')),
			__memo(() => import('../server/nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/posts",
				pattern: /^\/posts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/posts/[slug]",
				pattern: /^\/posts\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());

export const config = {
	path: ["/*"],
	excludedPath: ["/.netlify/*"],
	preferStatic: true
};
