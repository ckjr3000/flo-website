import { createImageUrlBuilder } from "@sanity/image-url";
import { c as client } from "./client.js";
const builder = createImageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}
export {
  urlFor as u
};
