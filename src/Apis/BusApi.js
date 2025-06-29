import axiosInstance from "../Services/AxiosInstance";
export const getBuses = async ({ PageNumber=1 , PageSize=100 , Filter=0 , Plate , OwneId}) => {
  try {
    const response = await axiosInstance.get("/api/v1.0/Buses/admin" , {
        params :{
            PageNumber, 
            PageSize,
            Filter,
            OwneId,
            Plate,
        }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    alert(`${error}`);
    throw error;
  }
};

export const addBus = async (BusData)=>{
    const res = await axiosInstance.post("/api/v1.0/Buses/register",BusData);
    return res.id
}


export const deleteData = async (id)=>{
    const res = await axiosInstance.delete(`/api/v1.0/Buses/${id}`)
    return res.id;
}