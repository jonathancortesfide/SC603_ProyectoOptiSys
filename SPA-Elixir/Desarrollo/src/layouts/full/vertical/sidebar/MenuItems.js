import { uniqueId } from 'lodash';

import {
  IconAperture,
  IconSettings,
  IconCurrencyDollar,
  IconUsers,
  IconPackage
} from '@tabler/icons';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
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
    title: 'Productos',
    icon: IconPackage,
    href: '/productos',
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
        title: 'Tipo de lente',
        icon: IconAperture,
        href: '/mantenimientos/tipo-lente',
      },
    ],
  },
  

];

export default Menuitems;
