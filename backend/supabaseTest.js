// insert.js

import { insertRow, selectById , selectRows, updateRowById, dropRowById, dropRows} from "./lib/dbService.js";

// const data =  {
//     name: "Vijaya",
//     email: "vijaya3@example.com",
//     age: 80
//   }
// const result = await insertRow("users", data)
// console.log(result);

// const res = await selectById("users", {id: "4751eabf-3ff2-47d8-9ea4-79f709d0b25d" });
// console.log(res)

// const res = await selectRows("users", {age: {op:"eq", value:23}, email:{op:"eq", value:"vijaya@example.com"}} )
// console.log(res)


// const res = await selectRows("users", {age: {op:"gte", value:22}}, ["name", "age"],{column:"age", order:"asc"})
// console.log(res)

// const res = await updateRowById("users", {id:"4751eabf-3ff2-47d8-9ea4-79f709d0b25d"}, {age:20, email: "s@a.com"})
// console.log(res)

const res = await dropRowById("users", {id:"88612881-872b-4516-820e-f585fc126d91"})
console.log(res)

// const res = await dropRows("users", {age:{op:"gte", value:"60"}})
// console.log(res)