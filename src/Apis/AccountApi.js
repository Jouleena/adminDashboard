import axiosInstance from "../Services/AxiosInstance";

export const getAccounts = async ({ PageNumber=1 , PageSize=10 , PhoneNumber}) => {
  try {
    const response = await axiosInstance.get("/api/v1.0/Account/search/by-phonenumber" , {
        params :{
            PageNumber, 
            PageSize,
            PhoneNumber
        }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};