import { ISpeciality } from '../../../models/ISpeciality';

export const getSpecialityById = (specialities: ISpeciality[], id: string) => {
  let name = '';
  specialities?.forEach((speciality: ISpeciality) => {
    if (speciality.id == id) {
      name = speciality.name;
      return;
    }
  });
  return name;
};
