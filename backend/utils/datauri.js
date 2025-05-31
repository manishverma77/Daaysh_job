import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error("File is missing or invalid in getDataUri");
  }

  const ext = path.extname(file.originalname);
  return parser.format(ext, file.buffer);
};

export default getDataUri;
