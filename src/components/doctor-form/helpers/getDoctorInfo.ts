import { ICity } from '../../../models/ICity';
import { ISpeciality } from '../../../models/ISpeciality';

export const getDoctorInfo = (
  citiesArr: ICity[],
  specialitiesArr: ISpeciality[],
  cityId: string,
  specId: string
) => {
  let doctorCity = '';
  let doctorSpeciality = '';
  citiesArr?.forEach((city: ICity) => {
    if (city.id === cityId) {
      doctorCity = city.name;
      return;
    }
  });
  specialitiesArr?.forEach((speciality: ISpeciality) => {
    if (speciality.id === specId) {
      doctorSpeciality = speciality.name;
      return;
    }
  });

  return { doctorCity, doctorSpeciality };
};
