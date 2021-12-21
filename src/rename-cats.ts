import { readdirSync, renameSync } from "fs";

const path = "./assets/cats";
const pictures = readdirSync(path).filter(filename => ["jpg", "jpeg"].includes(filename.split(".").pop()?.toLowerCase() || ""));

let count = 0;
for (const picture of pictures) {
    const extension = picture.split(".").pop()?.toLowerCase();
    renameSync(`${path}/${picture}`, `${path}/${count}.${extension}`);
    count++;
}