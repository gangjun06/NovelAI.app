const { readFileSync, writeFileSync } = require("fs");
const { randomUUID } = require("crypto");

const regex = new RegExp(
  "^([가-힇]+)/([가-힇]+) : ([가-힇 ]+) ([a-zA-Z_, ]+)$"
);

const main = async () => {
  const file = readFileSync("./tags.txt");
  const fileStr = file.toString();
  const splited = fileStr.split("\n");

  const result = [];

  splited.forEach((str) => {
    const parsed = regex.exec(str.trim());
    if (!parsed) return;

    const [, category, subCategory, name, tags] = parsed;
    result.push({ id: randomUUID(), category, subCategory, name, tags });
  });

  writeFileSync("./tags.json", JSON.stringify(result));
};
main();
