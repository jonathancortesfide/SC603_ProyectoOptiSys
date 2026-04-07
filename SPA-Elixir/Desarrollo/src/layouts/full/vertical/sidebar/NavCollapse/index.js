import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ListItemIcon, ListItem, Collapse, styled, ListItemText, useTheme } from '@mui/material';
import NavItem from '../NavItem';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { useTranslation } from 'react-i18next';


const NavCollapse = ({ menu, level, pathWithoutLastPart, pathDirect, onClick, hideMenu }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = menu.icon;
  const theme = useTheme();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuIcon =
    level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.3rem" />;

  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  // childActive: true when the current route is a child of this menu (e.g. /mantenimientos/moneda)
  const childActive = pathWithoutLastPart === menu.href;

  // If the user navigates away from this family's path, collapse the group.
  React.useEffect(() => {
    if (!pathname.startsWith(menu.href)) {
      setOpen(false);
    }
  }, [pathname, menu.href]);
  const ListItemStyled = styled(ListItem)(() => ({
    marginBottom: '2px',
    padding: '8px 10px',
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
      // Use the same solid color (#5D87FF) when the group is open or a child route is active.
      backgroundColor: (open && level < 2) || childActive ? '#5D87FF' : '',
      // Ensure MUI selected class uses solid color by default, but allow hover
      // to show a lighter background for visual feedback.
      '&.Mui-selected': {
        backgroundColor: '#5D87FF',
        color: 'white',
      },
      '&.Mui-selected:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    whiteSpace: 'nowrap',
    '&:hover': {
      // On hover show the same light background and primary text for consistency
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    color:
      (open && level < 2) || childActive
        ? 'white'
        : level > 1 && open
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
    fontWeight: childActive ? 600 : 'normal',
    borderRadius: `${customizer.borderRadius}px`,
  }));
  
  // If Menu has Children
  const submenus = menu.children?.map((item) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    }
  });

  return (
    <React.Fragment key={menu.id}>
      <ListItemStyled
        button
        component="li"
        onClick={handleClick}
        selected={open}
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">{hideMenu ? '' : <>{t(`${menu.title}`)}</>}</ListItemText>
        {!open ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
      </ListItemStyled>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {submenus}
      </Collapse>
    </React.Fragment>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  pathWithoutLastPart: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavCollapse;
