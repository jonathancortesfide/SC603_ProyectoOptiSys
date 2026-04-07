import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/dark-logo.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/dark-rtl-logo.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/light-logo.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/light-logo-rtl.svg';
import { styled, Typography, Box } from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {customizer.activeMode === 'dark' ? (
          <LogoLight />
        ) : (
          <LogoDark />
        )}
        {!customizer.isCollapse ? (
          <Box>
            <Typography variant="h5" fontWeight={700} color="textPrimary" lineHeight={1}>
              LENSYS
            </Typography>
          </Box>
        ) : null}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled
      to="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {customizer.activeMode === 'dark' ? (
        <LogoDarkRTL />
      ) : (
        <LogoLightRTL />
      )}
      {!customizer.isCollapse ? (
        <Box>
          <Typography variant="h5" fontWeight={700} color="textPrimary" lineHeight={1}>
            LENSYS
          </Typography>
        </Box>
      ) : null}
    </LinkStyled>
  );
};

export default Logo;
