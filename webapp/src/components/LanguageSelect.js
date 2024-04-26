import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const LanguageSelect = ({ value, onChange }) => {
  return (
    <FormControl className='language' fullWidth margin="normal" sx={{ display:'block', marginTop:'0.2em' }}>
      <Select labelId="language-label" id="language-select" value={value} onChange={onChange}>
        <MenuItem value="en"><FormattedMessage id="langen" /></MenuItem>
        <MenuItem value="es"><FormattedMessage id="langes" /></MenuItem>
        <MenuItem value="it"><FormattedMessage id="langit" /></MenuItem>
        <MenuItem value="fr"><FormattedMessage id="langfr" /></MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelect;
