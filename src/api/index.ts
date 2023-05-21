import axios from 'axios';

const instence = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

export const getCities = async () => {
  const { data } = await instence.get('9fcb58ca-d3dd-424b-873b-dd3c76f000f4');
  return data;
};

export const getSpecialities = async () => {
  const { data } = await instence.get('e8897b19-46a0-4124-8454-0938225ee9ca');
  return data;
};

export const getDoctors = async () => {
  const { data } = await instence.get('3d1c993c-cd8e-44c3-b1cb-585222859c21');
  return data;
};
