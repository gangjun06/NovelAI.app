const { readFileSync, writeFileSync } = require("fs");
const { randomUUID } = require("crypto");

const regex = new RegExp(
  "^([가-힇]+)/([가-힇]+) : ([가-힇0-9 ]+) ([a-zA-Z_,* ]+)$"
);

const NSFW = [
  "유륜",
  "젖꼭지",
  "젖꼭지",
  "알몸",
  "성기",
  "자지",
  "정액",
  "콘돔",
  "보지",
  "애액",
  "음모",
  "음핵",
  "성행위",
  "도구",
  "애무",
];

const main = async () => {
  const file = readFileSync("./tags.txt");
  const fileStr = file.toString();
  const splited = fileStr.split("\n");

  const result = [];

  splited.forEach((str) => {
    const parsed = regex.exec(str.trim());
    if (!parsed) return;

    const [, category, subCategory, name, tags] = parsed;
    result.push({
      id: randomUUID(),
      category,
      subCategory,
      name,
      tags,
      nsfw: NSFW.includes(category),
    });
  });

  writeFileSync("./tags.json", JSON.stringify(result));
};
main();
