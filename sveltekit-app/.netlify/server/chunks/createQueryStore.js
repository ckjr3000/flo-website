import { createQueryStore as createQueryStore$1 } from "@sanity/core-loader";
import { w as writable, d as derived } from "./index2.js";
import "fast-deep-equal";
import { defineEncodeDataAttribute } from "@sanity/core-loader/encode-data-attribute";
import "clsx";
function defineStudioUrlStore(client) {
  return writable(typeof client === "object" ? client?.config().stega.studioUrl : void 0);
}
function defineUseLiveMode({ enableLiveMode, studioUrlStore }) {
  return ({ allowStudioOrigin, client, onConnect, onDisconnect, studioUrl } = {}) => {
    if (allowStudioOrigin) {
      console.warn("`allowStudioOrigin` is deprecated and no longer needed");
    }
    studioUrlStore.set(studioUrl ?? (typeof client === "object" ? client?.config().stega.studioUrl : void 0));
    return enableLiveMode({
      client,
      onConnect,
      onDisconnect
    });
  };
}
function useEncodeDataAttribute(result, sourceMap, studioUrl) {
  return defineEncodeDataAttribute(result, sourceMap, studioUrl);
}
function defineUseQuery({ createFetcherStore, studioUrlStore }) {
  const DEFAULT_PARAMS = {};
  const DEFAULT_OPTIONS = {};
  return (query, params = DEFAULT_PARAMS, options = DEFAULT_OPTIONS) => {
    if (typeof query === "object") {
      params = query.params || DEFAULT_PARAMS;
      options = query.options || DEFAULT_OPTIONS;
      query = query.query;
    }
    const initial = options.initial ? { perspective: "published", ...options.initial } : void 0;
    const parsedParams = JSON.parse(JSON.stringify(params));
    const fetcherStore = createFetcherStore(query, parsedParams, initial);
    {
      fetcherStore.setKey("loading", false);
    }
    const snapshot = writable(fetcherStore.value);
    const queryValue = derived([snapshot, studioUrlStore], ([value, studioUrl]) => ({
      ...value,
      encodeDataAttribute: useEncodeDataAttribute(value.data, value.sourceMap, studioUrl)
    }));
    return queryValue;
  };
}
const createQueryStore = (options) => {
  const { createFetcherStore, setServerClient: setServerClient2, enableLiveMode, unstable__cache, unstable__serverClient: unstable__serverClient2 } = createQueryStore$1({
    tag: "svelte-loader",
    ...options
  });
  const studioUrlStore = defineStudioUrlStore(options.client);
  const useQuery2 = defineUseQuery({ createFetcherStore, studioUrlStore });
  const useLiveMode = defineUseLiveMode({
    enableLiveMode,
    studioUrlStore
  });
  const loadQuery2 = async (query, params = {}, options2 = {}) => {
    const { headers, tag } = options2;
    const perspective = options2.perspective || unstable__serverClient2.instance?.config().perspective || "published";
    const stega = options2.stega ?? unstable__serverClient2.instance?.config().stega ?? false;
    if (typeof document !== "undefined") {
      throw new Error("Cannot use `loadQuery` in a browser environment, you should use it inside a load function.");
    }
    if (perspective !== "published" && !unstable__serverClient2.instance) {
      throw new Error(`You cannot use other perspectives than "published" unless call "setServerClient" first.`);
    }
    if (perspective === "published") {
      const useCdn = options2.useCdn || unstable__serverClient2.instance.config().useCdn;
      const { result: result2, resultSourceMap: resultSourceMap2 } = await unstable__cache.instance.fetch(JSON.stringify({ query, params, perspective, useCdn, stega }));
      return { data: result2, sourceMap: resultSourceMap2 };
    }
    if (!unstable__serverClient2.canPreviewDrafts) {
      throw new Error(`You cannot use "drafts" unless you set a "token" in the "client" instance passed to "setServerClient".`);
    }
    const { result, resultSourceMap } = await unstable__serverClient2.instance.fetch(query, params, {
      filterResponse: false,
      resultSourceMap: "withKeyArraySelector",
      perspective,
      useCdn: false,
      headers,
      tag,
      stega
    });
    return { data: result, sourceMap: resultSourceMap };
  };
  return {
    loadQuery: loadQuery2,
    useQuery: useQuery2,
    setServerClient: setServerClient2,
    useLiveMode,
    unstable__serverClient: unstable__serverClient2
  };
};
const {
  /** @public */
  loadQuery,
  /** @public */
  setServerClient,
  /** @public */
  useQuery,
  /** @internal */
  unstable__serverClient
} = createQueryStore({
  client: false,
  ssr: true
});
export {
  useQuery as a,
  loadQuery as l,
  setServerClient as s,
  unstable__serverClient as u
};
