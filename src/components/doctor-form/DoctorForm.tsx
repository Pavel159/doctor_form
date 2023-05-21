import { FC, useEffect, useMemo, useState } from 'react';
import cl from './DoctorForm.module.scss';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { getCities, getDoctors, getSpecialities } from '../../api';
import { useFormik } from 'formik';
import validationSchema from '../../validations/validationSchema';
import Button from '@mui/material/Button';
import { ICity } from '../../models/ICity';
import { ISpeciality } from '../../models/ISpeciality';
import { IDoctor } from '../../models/IDoctor';
import { getSpecialityById } from './helpers/getSpecialityById';
import AppDateField from '../UI/AppDateField';
import { getDoctorInfo } from './helpers/getDoctorInfo';
import { getAgeByBirthDate } from './helpers/getAgeByBirthDate';

interface IFormValues {
  name: string;
  birthdate: string | null;
  sex: string;
  city: string;
  speciality: string;
  doctor: string;
  email: string;
  phone: string;
}

const DoctorForm: FC = () => {
  const [cities, setCities] = useState<ICity[]>([]);
  const [specialities, setSpecialities] = useState<ISpeciality[]>([]);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>([]);

  const [currentBirthDate, setCurrentBirthDate] = useState<Date | null>(null);
  const [currentSex, setCurrentSex] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<ICity | undefined | null>(
    null
  );
  const [currentSpeciality, setCurrentSpeciality] = useState<
    ISpeciality | undefined | null
  >(null);

  /*-------------- Fetching data from api --------------*/

  useEffect(() => {
    getCities().then((data) => {
      setCities(data);
    });
    getSpecialities().then((data) => {
      setSpecialities(data);
    });
    getDoctors().then((data) => {
      setDoctors(data);
      setFilteredDoctors(data);
    });
  }, []);

  /*-------------- Filtering specialities by gender --------------*/

  const availableSpecialities = useMemo(() => {
    if (currentSex) {
      if (currentSex === 'Male') {
        return specialities?.filter(
          (speciality: ISpeciality) => speciality.params?.gender !== 'Female'
        );
      }
      if (currentSex === 'Female') {
        return specialities?.filter(
          (speciality: ISpeciality) => speciality.params?.gender !== 'Male'
        );
      }
    }
    return specialities;
  }, [currentSex, specialities]);

  /*-------------- Filtering doctors by city, speciality, age --------------*/

  const filterDoctorsByCity = (array: []) => {
    if (currentCity) {
      return array?.filter((item: IDoctor) => item.cityId === currentCity?.id);
    }
    return doctors;
  };

  const filterDoctorsBySpeciality = (array: []) => {
    if (currentSpeciality) {
      return array?.filter(
        (item: IDoctor) => item.specialityId === currentSpeciality?.id
      );
    }
    return array;
  };

  const filterDoctorsByAge = (array: []) => {
    if (currentBirthDate) {
      const age = getAgeByBirthDate(currentBirthDate);
      if (age! < 18) {
        return array?.filter((item: IDoctor) => item.isPediatrician);
      } else {
        return array?.filter((item: IDoctor) => item.isPediatrician === false);
      }
    }
    return array;
  };

  /*-------------- Applying multiple filters to doctors array --------------*/

  useEffect(() => {
    let result: any = doctors;
    result = filterDoctorsByCity(result);
    result = filterDoctorsBySpeciality(result);
    result = filterDoctorsByAge(result);
    setFilteredDoctors(result);
  }, [currentCity, currentSpeciality, currentBirthDate]);

  /*-------------- Formik configuration --------------*/

  const initialValues: IFormValues = {
    name: '',
    birthdate: null,
    sex: '',
    city: '',
    speciality: '',
    doctor: '',
    email: '',
    phone: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (data) => {
      alert(JSON.stringify(data, null, 2));
      formik.resetForm();
    },
  });

  const emailLabel = formik.values.phone ? 'Email' : 'Email *';
  const phoneLabel = formik.values.email ? 'Phone number' : 'Phone number *';

  return (
    <div className={cl.root}>
      <form className={cl.form} onSubmit={formik.handleSubmit}>
        {/*-------------- Name field --------------*/}

        <div className={cl.fieldContainer}>
          <TextField
            label='Name *'
            variant='outlined'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          <p className={cl.errorMessage}>
            {formik.errors.name && formik.touched.name
              ? formik.errors.name
              : null}
          </p>
        </div>
        {/*-------------- Birhdate field --------------*/}

        <div className={cl.fieldContainer}>
          <AppDateField
            name='birthdate'
            label='Birth date *'
            format='DD/MM/YYYY'
            value={formik.values.birthdate}
            onChange={(value) => {
              formik.setFieldValue('birthdate', value, true);
              setCurrentBirthDate(value.$d);
            }}
          />
          <p className={cl.errorMessage}>
            {formik.errors.birthdate && formik.touched.birthdate
              ? formik.errors.birthdate
              : null}
          </p>
        </div>
        {/*-------------- Sex field --------------*/}

        <div className={cl.fieldContainer}>
          <FormControl>
            <InputLabel id='sex-label'>Sex *</InputLabel>
            <Select
              labelId='sex-label'
              value={formik.values.sex}
              label='Sex'
              name='sex'
              onChange={(e) => {
                formik.setFieldValue('sex', e.target.value);
                setCurrentSex(e.target.value);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.sex && Boolean(formik.errors.sex)}>
              <MenuItem value='Male'>Male</MenuItem>
              <MenuItem value='Female'>Female</MenuItem>
            </Select>
          </FormControl>
          <p className={cl.errorMessage}>
            {formik.errors.sex && formik.touched.sex ? formik.errors.sex : null}
          </p>
        </div>
        {/*-------------- City field --------------*/}

        <div className={cl.fieldContainer}>
          <FormControl>
            <InputLabel id='city-label'>City *</InputLabel>
            <Select
              labelId='city-label'
              value={formik.values.city}
              label='City'
              name='city'
              onChange={(e) => {
                formik.setFieldValue('city', e.target.value);
                const selectedCity: ICity | undefined = cities.find(
                  (city: ICity) => {
                    return city.name === e.target.value;
                  }
                );
                setCurrentCity(selectedCity);
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}>
              {cities?.map((city: ICity) => (
                <MenuItem id={city.id} value={city.name} key={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <p className={cl.errorMessage}>
            {formik.errors.city && formik.touched.city
              ? formik.errors.city
              : null}
          </p>
        </div>
        {/*-------------- Speciality field --------------*/}

        <div className={cl.fieldContainer}>
          <FormControl>
            <InputLabel id='speciality-label'>Doctor speciality</InputLabel>
            <Select
              labelId='speciality-label'
              value={formik.values.speciality}
              label='Doctor speciality'
              name='speciality'
              onChange={(e) => {
                formik.setFieldValue('speciality', e.target.value);
                const selectedSpeciality: ISpeciality | undefined =
                  specialities.find((speciality: ISpeciality) => {
                    return speciality.name === e.target.value;
                  });
                setCurrentSpeciality(selectedSpeciality);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.speciality && Boolean(formik.errors.speciality)
              }>
              {availableSpecialities?.map((speciality: ISpeciality) => (
                <MenuItem value={speciality.name} key={speciality.id}>
                  {speciality.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/*-------------- Doctor field --------------*/}

        <div className={cl.fieldContainer}>
          <FormControl>
            <InputLabel id='doctor-label'>Doctor *</InputLabel>
            <Select
              labelId='doctor-label'
              value={formik.values.doctor}
              label='Doctor'
              name='doctor'
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.setFieldValue('doctor', e.target.value);
                const selectedDoctor: any = doctors.find((doctor: IDoctor) => {
                  return doctor.surname === e.target.value;
                });
                const { cityId, specialityId } = selectedDoctor;
                const doctorInfo = getDoctorInfo(
                  cities,
                  specialities,
                  cityId,
                  specialityId
                );
                formik.setFieldValue('city', doctorInfo.doctorCity);
                formik.setFieldValue('speciality', doctorInfo.doctorSpeciality);
              }}
              error={formik.touched.doctor && Boolean(formik.errors.doctor)}>
              {filteredDoctors?.map((doctor: IDoctor) => (
                <MenuItem value={doctor.surname} key={doctor.id}>
                  <span>
                    {doctor.name} {doctor.surname}
                  </span>
                  <span style={{ marginLeft: '4px' }}>
                    ({getSpecialityById(specialities, doctor.specialityId)})
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <p className={cl.errorMessage}>
            {formik.errors.doctor && formik.touched.doctor
              ? formik.errors.doctor
              : null}
          </p>
        </div>
        {/*-------------- Email field --------------*/}

        <div className={cl.fieldContainer}>
          <TextField
            label={emailLabel}
            variant='outlined'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          <p className={cl.errorMessage}>
            {formik.errors.email && formik.touched.email
              ? formik.errors.email
              : null}
          </p>
        </div>
        {/*-------------- Phone field --------------*/}

        <div className={cl.fieldContainer}>
          <TextField
            label={phoneLabel}
            variant='outlined'
            name='phone'
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
          />
          <p className={cl.errorMessage}>
            {formik.errors.phone && formik.touched.phone
              ? formik.errors.phone
              : null}
          </p>
        </div>

        <Button type='submit' variant='contained'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default DoctorForm;
