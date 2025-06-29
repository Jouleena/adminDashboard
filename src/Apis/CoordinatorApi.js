import axiosInstance from "../Services/AxiosInstance";

export const getCoordinators = async ({ PageNumber=1 , PageSize=100}) => {
  try {
    const response = await axiosInstance.get("/api/v1.0/AssignCoordinator" , {
        params :{
            PageNumber, 
            PageSize,
        }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const AssignCoordinator = async (id)=>{
    try{
        const response = await axiosInstance.post(`/api/v1.0/AssignCoordinator/account/${id}/assign`);
        return response.id;
    } catch(error){
        console.log(error);
        throw error;
    }
}


export const UnAssignCoordinator = async (id)=>{
    try{
        const response = await axiosInstance.delete(`/api/v1.0/AssignCoordinator/${id}/unassign`);
        return response.id;
    } catch(error){
        console.log(error);
        throw error;
    }
}