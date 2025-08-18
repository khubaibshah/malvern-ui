import axios from 'axios';
import { useVehicleStore } from '@/stores/vehicleData'
import type { Car, GetAllCarsResponse } from '@/interfaces/car.interface'


class VehicleService {
  
  getDvsaVehicleByReg = async (registrationNumber: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/dvsa-vehicle-details-scs/${registrationNumber}`);
      console.log('Fetched vehicle data by Registration from dvsa data:', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /** 
   * Get all available vehicles
   * 
   * */
  getAllVehicles = async (): Promise<GetAllCarsResponse> => {
  try {
    const response = await axios.get<GetAllCarsResponse>(`${import.meta.env.VITE_API_BASE_URL}/scs/vehicle`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all vehicles:', error);
    throw error;
  }
  };

  /** Get vehicles by advanced filters */
  getVehiclesByFilters = async (filters: any) => {
    const params: any = {};

    if (filters.price_min !== undefined && filters.price_max !== undefined) {
      params.price_min = filters.price_min;
      params.price_max = filters.price_max;
    }

    if (filters.mileage !== undefined) {
      params.mileage = filters.mileage;
    }

    if (filters.types?.length) {
      params.types = filters.types.join(',');
    }

    if (filters.features?.length) {
      params.features = filters.features.join(',');
    }

    if (filters.color) {
      params.color = filters.color;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/vehicle/advanced-filters`, {
      params,
    });

    return response.data;
  };

  /** 
   * Load all vehicles 
   * 
   * */
  loadVehicles = async () => {
    const vehicleStore = useVehicleStore();
    if (vehicleStore.vehiclesLoaded) {
      return vehicleStore.getVehicles;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/vehicle`);
      const cars = response.data.cars || [];
      vehicleStore.setVehicles(cars);
      return cars;
    } catch (error) {
      console.error('Failed to fetch vehicle data:', error);
      throw error;
    }
  };

  getVehicleById = async (vehicleId: number | string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicle by ID:', error);
    throw error;
  }
  };

}


export default new VehicleService();
