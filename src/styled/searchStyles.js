import { makeStyles } from '@mui/styles'; 

export const searchStyles = makeStyles((theme) => ({
  root: {
    '&.Mui-focused': {
      borderRadius: '24px 24px 0 0',
    },
    '& .MuiAutocomplete-inputRoot': { 
      width: '100%',
      backgroundColor: '#f1f3f4',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: 'none',
      '& input': {
        padding: '0.25rem 1rem',
        border: 'none',
        flex: '1',
        lineHeight: '1.2',
        marginLeft: '8px',
      },
      '&:hover': {
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      '&:focus': {
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 255, 0.1)',
        borderRadius: '24px 24px 0 0',
      },
    },
    '& .MuiAutocomplete-endAdornment': {
      display: 'none',
    },
  },
})); 
