import axios from 'axios';


class JobCategoryService {
  
    // Function to fetch job cetgories details from malvern API
    getJobCat = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/admin/customer-job-category');
        
        // Assuming the response contains the job cet details
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Function to fetch vehicle details from DVLA API
    getJobSubCat = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/admin/customer-job-sub-categories');
        
        // Assuming the response contains the job cet details
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    // Function to fetch vehicle details from DVLA API
    getjobsAndSubJobs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/admin/customer-allCategories');
        
        // Assuming the response contains the job cet details
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

}

export default new JobCategoryService()