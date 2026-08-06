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
  , IconHeartbeat
  , IconUserCheck,
  IconUserSearch,
  IconUsers,
  IconBarcode,
  IconBoxMultiple1,
  IconPackage,
  IconBuildingStore,
  IconFileInvoice,
} from '@tabler/icons';

const getMenuItems = (hasPermission) => [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Inicio',
    icon: IconAperture,
    href: '/sample-page',
  },
  {
    navlabel: true,
    subheader: 'Other',
  },
  ...(hasPermission('PACIENTE_VER') ? [{
    id: uniqueId(),
    title: 'Pacientes',
    icon: IconUsers,
    href: '/pacientes',
  }] : []),
  ...(hasPermission('PRODUCTO_VER') ? [{
    id: uniqueId(),
    title: 'Productos',
    icon: IconPackage,
    href: '/productos',
  }] : []),
  ...(hasPermission('FACTURA_VER') ? [{
    id: uniqueId(),
    title: 'Facturación',
    icon: IconFileInvoice,
    href: '/facturacion',
  }] : []),
  ...(hasPermission('EXAMEN_VER') ? [{
    id: uniqueId(),
    title: 'Examenes',
    icon: IconStar,
    href: '/verexamenes',
  }] : []),
  ...(hasPermission('USUARIO_VER') ? [{
    id: uniqueId(),
    title: 'Seguridad',
    icon: IconKey,
    href: '/seguridad',
  }] : []),
  ...(hasPermission('MONEDA_VER') || hasPermission('PROVEEDOR_VER') || hasPermission('TIPO_LENTE_VER') ? [{
    id: uniqueId(),
    title: 'Mantenimientos',
    icon: IconSettings,
    href: '/mantenimientos',
    children: [
      ...(hasPermission('MONEDA_VER') ? [{
        id: uniqueId(),
        title: 'Monedas',
        icon: IconCurrencyDollar,
        href: '/mantenimientos/moneda',
      }] : []),
      ...(hasPermission('PROVEEDOR_VER') ? [{
        id: uniqueId(),
        title: 'Proveedores',
        icon: IconBuildingStore,
        href: '/mantenimientos/proveedor',
      }] : []),
      ...(hasPermission('TIPO_LENTE_VER') ? [{
        id: uniqueId(),
        title: 'Tipo de lente',
        icon: IconAperture,
        href: '/mantenimientos/tipo-lente',
      }] : []),
    ],
  }] : []),
];

export default getMenuItems;
