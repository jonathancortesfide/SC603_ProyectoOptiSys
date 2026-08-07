import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import img1 from 'src/assets/images/profile/user-11.jpg';
import { IconPower } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import useAuth from 'src/guards/authGuard/UseAuth';
import { getCurrentUsername } from 'src/utils/session';
import { getSessionClaim } from 'src/utils/session';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const { t } = useTranslation();
  const username = getCurrentUsername();
  const email = getSessionClaim('email');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
      sx={{
        m: 2,
        p: 1.25,
        borderRadius: 2,
        bgcolor: 'secondary.light',
        minHeight: 56,
        overflow: 'hidden',
      }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt={username} src={img1} />

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" color="textPrimary" noWrap>{username}</Typography>
            {email && (
              <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 120, display: 'block' }}>{email}</Typography>
            )}
          </Box>
          <Box sx={{ ml: 'auto', flexShrink: 0 }}>
            <Tooltip title={t('Logout')} placement="top">
              <IconButton color="primary" onClick={handleLogout} aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
