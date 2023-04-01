import axios from "axios";
import * as FormData from "form-data";
import { createReadStream, createWriteStream, writeFileSync } from "fs";

function uploadBlocks(filepath: string) {
   let counter = 0;
   const formData = new FormData();

   const filestream = createReadStream(filepath, {
      highWaterMark: 1000000,
   });

   filestream.on("data", (chunk) => {
      counter++;
      formData.append("block", chunk, {
         filename: `${filepath.split("/").slice(-1)}-block-${counter}`,
      });
   });

   filestream.once("end", () => {
      axios
         .post("http://localhost:6789/storage/uploadBlocks", formData, {
            headers: { ...formData.getHeaders(), Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.amFoZWVu.7K9r5DOGJvCt1LjL7AiPy82XkVO4iqztLxsLVWfYvrQ" },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
         })
         .then((response) => console.log(response.data.uploadedBlocks))
         .catch((err) => console.log(err));
   });
}

function downloadBlocks(blockIdentifiers: string[]) {
   const filestream = createWriteStream(`${__dirname}/downloaded/doc.pdf`);
   axios
      .get(
         `http://localhost:6789/storage/getBlocks/${JSON.stringify(
            blockIdentifiers
         )}`,
         { responseType: "stream", headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.amFoZWVu.7K9r5DOGJvCt1LjL7AiPy82XkVO4iqztLxsLVWfYvrQ" } }
      )
      .then((res) => {
         res.data.pipe(filestream);
         console.log(res.data.length);
      })
      .catch((err) => console.log(err));
}

function deleteBlocks(blockIdentifiers: string[]) {
   axios.delete(`http://localhost:6789/storage/deleteBlocks/${JSON.stringify(blockIdentifiers)}`, {
      headers: {
         Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.amFoZWVu.7K9r5DOGJvCt1LjL7AiPy82XkVO4iqztLxsLVWfYvrQ"
      }
   })
      .then(response => console.log(response.data))
      .catch(err => console.log(err.toJSON()))
}


// run Test functions
// uploadBlocks(`${__dirname}/files/doc.pdf`);

const BLOCKS = [
   "doc.pdf-block-1",
   "doc.pdf-block-2",
   "doc.pdf-block-3",
   "doc.pdf-block-4",
   "doc.pdf-block-5",
   "doc.pdf-block-6",
   "doc.pdf-block-7",
   "doc.pdf-block-8",
   "doc.pdf-block-9",
   "doc.pdf-block-10",
   "doc.pdf-block-11",
   "doc.pdf-block-12",
   "doc.pdf-block-13",
   "doc.pdf-block-14",
   "doc.pdf-block-15",
   "doc.pdf-block-16",
   "doc.pdf-block-17",
   "doc.pdf-block-18",
   "doc.pdf-block-19",
   "doc.pdf-block-20",
   "doc.pdf-block-21",
   "doc.pdf-block-22"
]

// downloadBlocks(BLOCKS);

// deleteBlocks(BLOCKS);
