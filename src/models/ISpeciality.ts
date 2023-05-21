export interface ISpeciality {
  id: string;
  name: string;
  params?: IParams;
}

export interface IParams {
  minAge?: number;
  maxAge?: number;
  gender?: string;
}
