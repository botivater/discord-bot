import { readdirSync, renameSync } from "fs";

const path = "./assets";
const pictures = readdirSync(path).filter((filename) =>
  ["jpg", "jpeg"].includes(filename.split(".").pop()?.toLowerCase() || "")
);

let count = 0;
for (const picture of pictures) {
  let extension = picture.split(".").pop()?.toLowerCase();
  if (extension === "jpeg") extension = "jpg";
  renameSync(`${path}/${picture}`, `${path}/${count}.${extension}`);
  count++;
}
