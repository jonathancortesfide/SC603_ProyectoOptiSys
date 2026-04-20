import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled, Box } from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: customizer.isCollapse ? 'center' : 'flex-start',
  }));

  return (
    <LinkStyled
      to="/"
      style={{
        padding: customizer.isCollapse ? '8px 0 0 0' : '24px 0 0 28px',
      }}
    >
      <Box
        component="img"
        src="/lensys_logo.png"
        alt="Lensys"
        sx={{
          width: customizer.isCollapse ? 32 : 150,
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </LinkStyled>
  );
};

export default Logo;
