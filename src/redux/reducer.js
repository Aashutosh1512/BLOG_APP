import { ADD_TO_CARD, REMOVE_TO_CARD } from "./constant";


export const cartData=(data=[],action)=>{
    console.log("Reducer called!",action)
    // if (action.type === ADD_TO_CARD) {
    //   return action.data;
    // } else {
    //   return 1;
    // }
    switch (action.type) {
      case ADD_TO_CARD:
        console.warn("ADD TO CARD");
        return [action.data, ...data];
      case REMOVE_TO_CARD:
        console.log("REMOVE TO CARD")
      return [action.data,...data];
      default:
       return [];
    }
}