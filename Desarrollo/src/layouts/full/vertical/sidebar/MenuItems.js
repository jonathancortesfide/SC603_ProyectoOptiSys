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
  , IconCurrencyDollar, IconTag
  , IconUserCheck,
  IconUserSearch,
  IconUsers
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
    icon: IconUsers,
    href: '/pacientes',
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
      {
        id: uniqueId(),
        title: 'Marcas',
        icon: IconTag,
        href: '/mantenimientos/marca',
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
