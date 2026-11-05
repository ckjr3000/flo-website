import {defineType, defineArrayMember, defineField} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // Inline image
    defineArrayMember({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        modal: {type: 'dialog'},
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the image for people using screen readers.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    // Inline PDF
    defineArrayMember({
      name: 'pdf',
      title: 'PDF',
      type: 'file',
      options: {
        accept: 'application/pdf',
        modal: {type: 'dialog'},
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Link text',
          type: 'string',
          description: 'Shown as the download link.',
        }),
      ],
    }),
    // Embeds (YouTube, SoundCloud, Bandcamp)
    defineArrayMember({
      name: 'embed',
      title: 'Embed',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          title: 'Link or embed code',
          type: 'text',
          rows: 3,
          description:
            'YouTube or SoundCloud: paste the link. Bandcamp: click Share / Embed on Bandcamp and paste the embed code.',
          validation: (Rule) =>
            Rule.required().custom((value) => {
              if (!value) return true
              const v = value.toLowerCase()
              if (v.includes('bandcamp.com') && !v.includes('embeddedplayer')) {
                return 'For Bandcamp, paste the embed code (Share / Embed), not the page link'
              }
              if (!/youtube\.com|youtu\.be|soundcloud\.com|bandcamp\.com/.test(v)) {
                return 'Only YouTube, SoundCloud and Bandcamp are supported'
              }
              return true
            }),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
      preview: {
        select: {title: 'url', subtitle: 'caption'},
        prepare: ({title, subtitle}) => ({
          title: title?.match(/youtube|youtu\.be/i)
            ? 'YouTube'
            : title?.match(/soundcloud/i)
              ? 'SoundCloud'
              : title?.match(/bandcamp/i)
                ? 'Bandcamp'
                : 'Embed',
          subtitle: subtitle ?? title,
        }),
      },
    }),
  ],
})