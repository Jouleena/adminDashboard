import axiosInstance from "../Services/AxiosInstance";
export const getLines = async ({ PageNumber=1 , PageSize=100 , CityFromID , CityToId}) => {
  try {
    const response = await axiosInstance.get("/api/v1.0/Lines" , {
        params :{
            PageNumber, 
            PageSize,
            CityFromID,
            CityToId
        }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addLine = async (LineData)=>{
    const res = await axiosInstance.post("/api/v1.0/Lines",LineData);
    return res.id
}


export const updateLine = async (LineData)=>{
    const res = await axiosInstance.put(`/api/v1.0/Lines`,LineData);
    return res.id;
}

export const deleteData = async (id)=>{
    const res = await axiosInstance.delete(`/api/v1.0/Lines/${id}`)
    return res.id;
}