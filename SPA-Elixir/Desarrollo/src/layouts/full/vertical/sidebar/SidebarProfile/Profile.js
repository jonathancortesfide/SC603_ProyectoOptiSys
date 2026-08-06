import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import img1 from 'src/assets/images/profile/user-11.jpg';
import { IconPower } from '@tabler/icons';
import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getCurrentUsername } from 'src/utils/session';
import { getSessionClaim } from 'src/utils/session';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const { t } = useTranslation();
  const username = getCurrentUsername();
  const email = getSessionClaim('email');
  
  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt={username} src={img1} />

          <Box>
            <Typography variant="h6" color="textPrimary">{username}</Typography>
            {email && (
              <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 120, display: 'block' }}>{email}</Typography>
            )}
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title={t('Logout')} placement="top">
              <IconButton color="primary" component={Link} to="/auth/login" aria-label="logout" size="small">
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
