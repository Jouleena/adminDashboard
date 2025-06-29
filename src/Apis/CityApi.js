import axiosInstance from "../Services/AxiosInstance";

export const getCities = async ({Name = "", PageNumber=1 , PageSize=100}) => {
  try {
    const response = await axiosInstance.get("/api/v1.0/Cities" , {
        params :{
            Name , 
            PageNumber, 
            PageSize,
        }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    alert(`${error}`)
    throw error;
  }
};

export const addCity = async (cityData)=>{
    const res = await axiosInstance.post("/api/v1.0/Cities",cityData);
    return res.id
}

export const updateCity = async (cityData)=>{
    const res = await axiosInstance.put(`/api/v1.0/Cities`,cityData);
    return res.id;
}

export const deleteData = async (id)=>{
    const res = await axiosInstance.delete(`/api/v1.0/Cities/${id}`)
    return res.id;
}