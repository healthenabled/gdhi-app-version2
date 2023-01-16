import chalk from "chalk";
import semver from "semver";
import shelljs from "shelljs";
import { readFile } from "fs/promises";

const checkVersions = async () => {
  console.log(shelljs);
  const {engines} = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url))
  );
  console.log(engines);
};
await checkVersions();
