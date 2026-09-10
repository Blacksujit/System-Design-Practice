import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://blacksujit.github.io',
  base: '/System-Design-Practice',
  integrations: [
    starlight({
      title: 'System Design Mastery',
      description:
        'The complete, open-source system design study plan — fundamentals to large-scale builds, with interview prep strategy, master plan, practice problems, and build projects.',
      editLink: {
        baseUrl: 'https://github.com/Blacksujit/System-Design-Practice/edit/main/',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Blacksujit/System-Design-Practice',
        },
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Master Plan', link: '/master-plan' },
            { label: 'Practice Problems', link: '/practice' },
            { label: 'Build Projects', link: '/build-projects' },
            { label: 'Resources', link: '/resources' },
            { label: 'Notes Template', link: '/notes-template' },
          ],
        },
        {
          label: 'Phase 1 · Foundations',
          items: [{ autogenerate: { directory: '01-fundamentals' } }],
        },
        {
          label: 'Phase 2 · Core Concepts',
          items: [
            {
              label: 'Networking',
              items: [{ autogenerate: { directory: '02-networking' } }],
            },
            {
              label: 'Databases',
              items: [{ autogenerate: { directory: '03-databases' } }],
            },
            {
              label: 'Caching',
              items: [{ autogenerate: { directory: '04-caching' } }],
            },
            {
              label: 'Load Balancing',
              items: [{ autogenerate: { directory: '05-load-balancing' } }],
            },
            {
              label: 'Message Queues',
              items: [{ autogenerate: { directory: '06-message-queues' } }],
            },
            {
              label: 'Consistent Hashing',
              items: [{ autogenerate: { directory: '07-consistent-hashing' } }],
            },
            {
              label: 'CAP Theorem',
              items: [{ autogenerate: { directory: '08-cap-theorem' } }],
            },
          ],
        },
        {
          label: 'Phase 3 · Classic Designs',
          items: [{ autogenerate: { directory: '09-projects' } }],
        },
        {
          label: 'Phase 4 · Large-Scale',
          items: [{ autogenerate: { directory: '10-large-scale' } }],
        },
        {
          label: 'Phase 5 · Advanced',
          items: [{ autogenerate: { directory: '11-advanced' } }],
        },
        {
          label: 'Phase 6 · Interview',
          items: [{ autogenerate: { directory: '12-interview-prep' } }],
        },
      ],
    }),
  ],
});