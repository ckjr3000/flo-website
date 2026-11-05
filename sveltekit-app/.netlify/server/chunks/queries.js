import groq from "groq";
const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  ...,
  body[]{
    ...,
    _type == "pdf" => {
      "url": asset->url,
      "filename": asset->originalFilename
    }
  }
}`;
const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;
const homeQuery = groq`{
  "bio": *[_type == "homePage"][0].bio,
  "posts": *[_type == "post" && defined(slug.current)] | order(_createdAt desc)
}`;
export {
  postQuery as a,
  homeQuery as h,
  postsQuery as p
};
