import axios from 'axios';


class JobCategoryService {
  
    // Function to fetch job cetgories details from malvern API
    getJobCat = async () => {
      try {
        const response = await axios.get('https://malvern-api-production.up.railway.app/admin/customer-job-category');
        
        // Assuming the response contains the job cet details
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Function to fetch vehicle details from DVLA API
    getJobSubCat = async () => {
      try {
        const response = await axios.get('https://malvern-api-production.up.railway.app/admin/customer-job-sub-categories');
        
        // Assuming the response contains the job cet details
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Function to fetch vehicle details from DVLA API
    getjobsAndSubJobs = async () => {
      try {
        const response = await axios.get('https://malvern-api-production.up.railway.app/admin/customer-allCategories');
        
        // Assuming the response contains the job cet details
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

}

export default new JobCategoryService()