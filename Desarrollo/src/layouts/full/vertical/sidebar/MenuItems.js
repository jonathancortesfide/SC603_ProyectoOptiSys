import { uniqueId } from 'lodash';

import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconAperture,
  IconSettings,
  IconShield,
  IconShieldCheck,
  IconKey
  , IconCurrencyDollar
} from '@tabler/icons';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Sample Page',
    icon: IconAperture,
    href: '/sample-page',
    chip: 'New',
    chipColor: 'secondary',
  },
  {
    navlabel: true,
    subheader: 'Other',
  },
  {
    id: uniqueId(),
    title: 'Pacientes',
    icon: IconBoxMultiple,
    href: '/menulevel/',
    children: [
      {
        id: uniqueId(),
        title: 'Pacientes',
        icon: IconPoint,
        href: '/pacientes',
        permiso: 'usuarios',
      },
      {
        id: uniqueId(),
        title: 'Level 1.1',
        icon: IconPoint,
        href: '/l1.1',
        children: [
          {
            id: uniqueId(),
            title: 'Level 2',
            icon: IconPoint,
            href: '/l2',
          },
          {
            id: uniqueId(),
            title: 'Level 2.1',
            icon: IconPoint,
            href: '/l2.1',
            children: [
              {
                id: uniqueId(),
                title: 'Level 3',
                icon: IconPoint,
                href: '/l3',
              },
              {
                id: uniqueId(),
                title: 'Level 3.1',
                icon: IconPoint,
                href: '/l3.1',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Disabled',
    icon: IconBan,
    href: '/',
    disabled: true,
  },
  {
    id: uniqueId(),
    title: 'Examenes',
    subtitle: 'Crear nuevo exámen',
    icon: IconStar,
    href: '/examenes',
  },
  {
    id: uniqueId(),
    title: 'Seguridad',
    icon: IconKey,
    href: '/seguridad',
  },
  {
    id: uniqueId(),
    title: 'Mantenimientos',
    icon: IconSettings,
    href: '/mantenimientos',
    children: [
      {
        id: uniqueId(),
        title: 'Monedas',
        icon: IconCurrencyDollar,
        href: '/mantenimientos/moneda',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Chip',
    icon: IconAward,
    href: '/',
    chip: '9',
    chipColor: 'primary',
  },
  {
    id: uniqueId(),
    title: 'Outlined',
    icon: IconMoodSmile,
    href: '/',
    chip: 'outline',
    variant: 'outlined',
    chipColor: 'primary',
  },
  {
    id: uniqueId(),
    title: 'External Link',
    external: true,
    icon: IconStar,
    href: 'https://google.com',
  },
];

export default Menuitems;
