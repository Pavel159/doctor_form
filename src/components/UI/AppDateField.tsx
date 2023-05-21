import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FC } from 'react';

interface IDateFieldProps {
  label: string;
  value?: string | null;
  name?: string;
  format?: string;
  onChange?: (newValue: any) => void;
}

const AppDateField: FC<IDateFieldProps> = ({
  label,
  value,
  name,
  format,
  onChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateField
        label={label}
        value={value}
        onChange={onChange}
        name={name}
        format={format}
        color={'error'}
      />
    </LocalizationProvider>
  );
};

export default AppDateField;
