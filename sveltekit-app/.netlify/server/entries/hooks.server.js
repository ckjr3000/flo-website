import { error, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { a as assertEnvVar, c as client } from "../chunks/client.js";
import { u as unstable__serverClient, l as loadQuery, s as setServerClient } from "../chunks/createQueryStore.js";
import crypto from "crypto";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
const defineLoadQuery = ({ previewEnabled, loadQuery: loadQuery2, perspective, useCdn }) => {
  return (query, ...args) => {
    const [params, options = {}] = args;
    const stega = previewEnabled ? options.stega : false;
    return loadQuery2(query, ...[params, { ...options, perspective, useCdn, stega }]);
  };
};
const setLocals$1 = ({ event, loadQuery: loadQuery2, perspective, useCdn }) => {
  const previewEnabled = event.locals.sanity?.previewEnabled;
  event.locals.sanity = event.locals.sanity ?? {};
  event.locals.sanity.loadQuery = defineLoadQuery({
    previewEnabled,
    loadQuery: loadQuery2,
    perspective,
    useCdn
  });
};
const handleQueryLoader = (config) => {
  const client2 = unstable__serverClient.instance;
  if (!client2)
    throw new Error("No client instance provided to handleLoadQuery");
  const loadQuery$1 = loadQuery;
  const { perspective, useCdn } = client2.config();
  return async ({ event, resolve }) => {
    setLocals$1({
      event,
      loadQuery: loadQuery$1,
      perspective,
      useCdn
    });
    return await resolve(event);
  };
};
const handleEnablePreview = async ({ client: client2, event, previewCookieName, previewSecret, redirect: redirect2 }) => {
  const { isValid, redirectTo = "/", studioPreviewPerspective } = await validatePreviewUrl(client2, event.url.toString());
  if (!isValid) {
    throw error(401, "Invalid secret");
  }
  const devMode = process.env["NODE_ENV"] === "development";
  event.cookies.set(previewCookieName, previewSecret, {
    httpOnly: true,
    path: "/",
    sameSite: devMode ? "lax" : "none",
    secure: !devMode
  });
  if (studioPreviewPerspective) {
    event.cookies.set(perspectiveCookieName, studioPreviewPerspective, {
      httpOnly: true,
      path: "/",
      sameSite: devMode ? "lax" : "none",
      secure: !devMode
    });
  }
  return redirect2(307, redirectTo);
};
const handleDisablePreview = ({ event, previewCookieName, redirect: redirect2 }) => {
  event.cookies.delete(previewCookieName, { path: "/" });
  return redirect2(307, event.url.searchParams.get("redirect") || "/");
};
const setLocals = ({ client: providedClient, event, previewCookieName, previewSecret }) => {
  const previewEnabled = event.cookies.get(previewCookieName) === previewSecret;
  const perspective = previewEnabled ? "drafts" : "published";
  const useCdn = previewEnabled ? false : true;
  const client2 = providedClient.withConfig({
    perspective,
    useCdn
  });
  if (event.locals.sanity) {
    console.warn("Sequence `handlePreviewMode` before `handleQueryLoader` or `handleLiveLoader` in `hooks.server.ts` to ensure the `event.locals.sanity` properties are set correctly");
  }
  event.locals.sanity = event.locals.sanity ?? {};
  event.locals.sanity.client = client2;
  event.locals.sanity.previewEnabled = previewEnabled;
};
const handlePreviewMode = ({ client: client2, preview }) => {
  const disablePath = preview?.endpoints?.disable || "/preview/disable";
  const enablePath = preview?.endpoints?.enable || "/preview/enable";
  const previewCookieName = preview?.cookie || "__sanity_preview";
  const previewSecret = preview?.secret || crypto.randomBytes(16).toString("hex");
  const redirect$1 = preview?.redirect || redirect;
  if (!client2)
    throw new Error("No client configured for preview");
  return async ({ event, resolve }) => {
    if (event.url.pathname === enablePath) {
      return handleEnablePreview({
        client: client2,
        event,
        previewCookieName,
        previewSecret,
        redirect: redirect$1
      });
    }
    if (event.url.pathname === disablePath) {
      return handleDisablePreview({
        event,
        previewCookieName,
        redirect: redirect$1
      });
    }
    setLocals({
      client: client2,
      event,
      previewCookieName,
      previewSecret
    });
    return await resolve(event);
  };
};
const SANITY_API_READ_TOKEN = "skzER0VyqHISmvFHhNmLwQK20WoPU89VdrdDlkctTXhIIpIWumJJam9eigpWQAE44kZ7rB0Jz6d2ydXlYzVnpgM2cEgyhZ0d2XJ7r8CM0sQI9rLg2uDkr1uoz2eCMUIYqEoM7z7qKRNk4NpwPvCMn2hSdVhAm9efSEfWrZ6XU7g66b2djufu";
const token = assertEnvVar(SANITY_API_READ_TOKEN, "SANITY_API_READ_TOKEN");
const serverClient = client.withConfig({
  token,
  useCdn: false,
  stega: true
});
setServerClient(serverClient);
const handle = sequence(
  // This convenience function sets up preview mode endpoints and attaches useful
  // helpers to the `event.locals` Svelte object.
  handlePreviewMode({
    client: serverClient,
    preview: { redirect }
  }),
  // Sets up the loadQuery helper function which will be used for fetching data
  // on the server
  handleQueryLoader()
);
export {
  handle
};
