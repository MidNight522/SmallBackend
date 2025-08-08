"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIdForArray = void 0;
// export const asyncHandler = async (callback: any) => {
//   return new Promise((resolve, reject) => {
//     try {
//       callback;
//     } catch (error: any) {
//       res.status(404).send({ data: error.message });
//     }
//   });
// };
const generateIdForArray = (arr) => {
    let id = arr.length;
    const isSuchIdExists = arr.map((item) => item.id).includes(id.toString());
    if (!isSuchIdExists)
        return id.toString();
    while (true) {
        id++;
        const isSuchIdExists = arr.map((item) => item.id).includes(id.toString());
        if (!isSuchIdExists)
            continue;
        else
            break;
    }
    return id.toString();
};
exports.generateIdForArray = generateIdForArray;
