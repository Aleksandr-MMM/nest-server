export const addProperty =(...anyValue:object[]):any=>{
  let value;
  for(let i=0;anyValue.length>i;i++){
    value={...value,...anyValue[i]}
  }
  return value
}