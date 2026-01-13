import {
  LayoutDashboard,
  HelpCircle,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'ivpankaj',
    email: 'imvpankaj@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'OPH-Mart',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Banners',
          url: '/banners',
          icon: LayoutDashboard,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Profile',
          url: '/profile',
          icon: Users,
        },

      ],
    },

    {
      title: 'Category',
      items: [
        {
          title: 'All Categories',
          icon: ShieldCheck,
          items: [
            {
              title: 'Show Catogories',
              url: '/category',
            },
            {
              title: 'Sub Category',
              url: '/subcategory',
            },
          ],
        },
      ],
    },

    {
      title: 'Products',
      items: [
        {
          title: 'All Products',
          icon: ShieldCheck,
          items: [
            {
              title: 'Show Products',
              url: '/products',
            },
            {
              title: 'Create Products',
              url: '/products/create-products',
            },
             {
              title: 'All Admin Products',
              url: '/products/admin-products',
            },
          ],
        },
      ],
    },

    {
      title: 'Vendors',
      items: [
        {
          title: 'All Vendors',
          icon: ShieldCheck,
          items: [
            {
              title: 'Show Vendors',
              url: '/vendor',
            },
          ],
        },
      ],
    },

    {
      title: 'Template',
      items: [
        {
          title: 'Create Template',
          icon: ShieldCheck,
          items: [
            {
              title: 'Home Page Template',
              url: '/vendor-template',
            },
            {
              title: 'About Page Template',
              url: '/vendor-template-about',
            },
            {
              title: 'Contact Page Template',
              url: '/vendor-template-contact',
            },
                {
              title: 'Social Links and FAQs',
              url: '/vendor-template-other',
            },
          ],
        },
      ],
    },

    {
      title: 'Other',
      items: [
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
