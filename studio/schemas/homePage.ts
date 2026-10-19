import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page Customisation',
  preview: {
  prepare: () => ({title: 'Home Page'}),
    },    
  type: 'document',
  fields: [
    defineField({
        name: 'backgroundImage',
        title: 'Background Image',
        description: 'The image you want to use as your page background',
        type: 'image'
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],                                       
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],                            
            annotations: [],                              
          },
        },
      ],
    })
  ],
})