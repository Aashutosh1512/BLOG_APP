import { ADD_TO_CARD, REMOVE_TO_CARD } from "./constant"


export const addToCard=(data)=>{
    console.log("ACTION IS CALLED",data)
    return {
      type: ADD_TO_CARD,
      data: data,
    };
}