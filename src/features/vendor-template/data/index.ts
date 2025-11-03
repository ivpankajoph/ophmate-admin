export type TemplateData = {
  name: string
  previewImage: string // ImageKit URL
  components: {
    logo: string // ImageKit URL
    home_page: {
      header_text: string
      header_text_small: string
      button_header: string
      description: {
        large_text: string
        summary: string
        percent: { percent_in_number: string; percent_text: string }
        sold: { sold_number: string; sold_text: string }
      }
    }
    about_page: {
      hero: {
        backgroundImage: string // ImageKit URL
        title: string
        subtitle: string
      }
      story: {
        heading: string
        paragraphs: string[]
        image: string // ImageKit URL
      }
      values: Array<{ icon: string; title: string; description: string }>
      team: Array<{ name: string; role: string; image: string }> // ImageKit URL
      stats: Array<{ value: string; label: string }>
    }
    contact_page: {
      hero: {
        backgroundImage: string // ImageKit URL
        title: string
        subtitle: string
      }
      contactInfo: Array<{ icon: string; title: string; details: string }>
      contactForm: {
        heading: string
        description: string
        fields: Array<{
          label: string
          name: string
          type: string
          placeholder: string
          required: boolean
        }>
        submitButtonText: string
      }
      visitInfo: {
        heading: string
        description: string
        mapImage: string // ImageKit URL
        reasonsHeading: string
        reasonsList: string[]
      }
      faqSection: {
        heading: string
        subheading: string
        faqs: Array<{ question: string; answer: string }>
      }
      socialMedia: {
        facebook: string
        instagram: string
        whatsapp: string
        twitter: string
      }
    }
  }
}

export const initialData: TemplateData = {
  name: '',
  previewImage: '',
  components: {
    logo: '',
    home_page: {
      header_text: '',
      header_text_small: '',
      button_header: '',
      description: {
        large_text: '',
        summary: '',
        percent: { percent_in_number: '', percent_text: '' },
        sold: { sold_number: '', sold_text: '' },
      },
    },
    about_page: {
      hero: {
        backgroundImage: '',
        title: '',
        subtitle: '',
      },
      story: {
        heading: '',
        paragraphs: [''],
        image: '',
      },
      values: [{ icon: '', title: '', description: '' }],
      team: [{ name: '', role: '', image: '' }],
      stats: [{ value: '', label: '' }],
    },
    contact_page: {
      hero: {
        backgroundImage: '',
        title: '',
        subtitle: '',
      },
      contactInfo: [
        { icon: 'map-pin', title: 'Visit Us', details: '' },
        { icon: 'phone', title: 'Call Us', details: '' },
        { icon: 'mail', title: 'Email', details: '' },
      ],
      contactForm: {
        heading: '',
        description: '',
        fields: [
          {
            label: 'Full Name',
            name: 'fullName',
            type: 'text',
            placeholder: 'Enter your name',
            required: true,
          },
          {
            label: 'Email Address',
            name: 'email',
            type: 'email',
            placeholder: 'Enter your email',
            required: true,
          },
          {
            label: 'Message',
            name: 'message',
            type: 'textarea',
            placeholder: 'Write your message here',
            required: true,
          },
        ],
        submitButtonText: '',
      },
      visitInfo: {
        heading: '',
        description: '',
        mapImage: '',
        reasonsHeading: '',
        reasonsList: [''],
      },
      faqSection: {
        heading: '',
        subheading: '',
        faqs: [{ question: '', answer: '' }],
      },
      socialMedia: {
        facebook: 'string',
        instagram: 'string',
        whatsapp: 'string',
        twitter: 'string',
      },
    },
  },
}
