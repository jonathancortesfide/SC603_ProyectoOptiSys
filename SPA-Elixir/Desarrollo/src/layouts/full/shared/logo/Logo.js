import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import lenssysLogo from 'src/assets/images/logos/Logo LENSSYS.png';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: 86,
    width: customizer.isCollapse ? '64px' : '200px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: '20px 0 0 10px',
    '& img': {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      objectPosition: 'center center',
    }
  }));

  return (
    <LinkStyled to="/">
      <img src={lenssysLogo} alt="Logo LENSSYS" />
    </LinkStyled>
  );
};

export default Logo;
