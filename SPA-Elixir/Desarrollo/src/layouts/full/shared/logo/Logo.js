import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/Logo en blanco.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/Logo sin degradado.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/Logo sin degradado.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/Logo positivo.svg';
import { styled } from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 10px',
    '& svg': {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    }
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/">
        {customizer.activeMode === 'dark' ? (
          <LogoDark />
        ) : (
          <LogoLight />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled to="/">
      {customizer.activeMode === 'dark' ? (
        <LogoDarkRTL />
      ) : (
        <LogoLightRTL />
      )}
    </LinkStyled>
  );
};

export default Logo;
