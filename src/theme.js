import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FF41',
      light: '#39FF14',
      dark: '#00cc33',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1a1a1a',
    },
    background: {
      default: '#000000',
      paper: '#0d0d0d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
    },
    divider: 'rgba(0, 255, 65, 0.15)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    code: {
      fontFamily: '"Fira Code", "JetBrains Mono", "Courier New", monospace',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: '#00FF41',
          color: '#000000',
          '&:hover': {
            background: '#39FF14',
            boxShadow: '0 0 20px rgba(0,255,65,0.4)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(0,255,65,0.5)',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#00FF41',
            background: 'rgba(0,255,65,0.05)',
            boxShadow: '0 0 15px rgba(0,255,65,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            '& fieldset': {
              borderColor: 'rgba(0,255,65,0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,255,65,0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00FF41',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00FF41',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontFamily: '"Fira Code", monospace',
          fontSize: '0.7rem',
        },
      },
    },
  },
});

export default theme;
