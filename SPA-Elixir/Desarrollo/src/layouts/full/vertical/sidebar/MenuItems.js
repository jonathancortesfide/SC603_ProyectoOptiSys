import { uniqueId } from 'lodash';

import {
  IconBoxMultiple,
  IconAperture,
  IconSettings,
  IconCurrencyDollar,
  IconTag,
  IconUserCheck,
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
        title: 'Marcas',
        icon: IconTag,
        href: '/mantenimientos/marca',
      },
      {
        id: uniqueId(),
        title: 'Listas de precio',
        icon: IconCurrencyDollar,
        href: '/mantenimientos/lista-precio',
      },
      {
        id: uniqueId(),
        title: 'Tipo de lente',
        icon: IconAperture,
        href: '/mantenimientos/tipo-lente',
      },
      {
        id: uniqueId(),
        title: 'Clasificación pacientes',
        icon: IconUserCheck,
        href: '/mantenimientos/clasificacion-pacientes',
      },
      {
        id: uniqueId(),
        title: 'Grupos de productos',
        icon: IconBoxMultiple,
        href: '/mantenimientos/grupos-productos',
      },
    ],
  },
  

];

export default Menuitems;
