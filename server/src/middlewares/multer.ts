import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    
    // ab file name [upload/uuid.extName]
    // uploads\5fc39ce6-f8b0-44a6-ae2d-81df80661a22.jpg
    // database me store hoga

    callback(null, fileName);
  },
});

export const singleUpload = multer({ storage }).single("photo");




////////////////////////////////////////////////////////////////////////////

//upload krne ke liye filename fun itna he kafi hai, but
// unique chahiye isliye uuid() id use kia 

// isme nich wale me jo file ka naam input file se upload kete the 
// wohi database me store hota tha 

// filename(req, file, callback) {
//     callback(null, file.originalname);
// },