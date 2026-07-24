import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';

import ProfileImg from 'src/assets/images/profile/user-11.jpg';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import useMounted from 'src/guards/authGuard/UseMounted';
import useAuth from 'src/guards/authGuard/UseAuth';
import { getCurrentUsername } from 'src/utils/session';
import { getSessionClaim } from 'src/utils/session';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const username = getCurrentUsername();
  const email = getSessionClaim('email');

  const mounted = useMounted();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      if (mounted.current) {
        handleClose2();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">Perfil</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar src={ProfileImg} alt={username} sx={{ width: 95, height: 95 }} />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {username}
                </Typography>
                {email && (
                  <Typography variant="caption" color="textSecondary">{email}</Typography>
                )}
              </Box>
            </Stack>
            <Divider />
            <Box mt={2}>
              <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
