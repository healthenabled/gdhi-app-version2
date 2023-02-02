import chalk from "chalk";
import semver from "semver";
import { readFile } from "fs/promises";
import { execa } from "execa";

const checkVersions = async () => {
  console.log(
    chalk.yellow(`Running predev script \nChecking versions of Node and Yarn\n`)
  );
  const { engines } = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url))
  );
  const versionRequirements = [
    {
      name: "node",
      currentVersion: semver.clean(process.version),
      versionRequirement: engines.node,
    },
  ];
  const { stdout: yarnPath } = await execa("which", ["yarn"]);
  if (!!yarnPath) {
    const { stdout } = await execa("yarn", ["--version"]);
    versionRequirements.push({
      name: "yarn",
      currentVersion: stdout,
      versionRequirement: engines.yarn,
    });
  }
  const warnings = [];
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(
        mod.name +
          ": " +
          chalk.red(mod.currentVersion) +
          " should be " +
          chalk.green(mod.versionRequirement)
      );
    }
  }

  if (warnings.length) {
    console.log("");
    console.log(
      chalk.yellow("For the app to work well, please update the below:")
    );
    console.log();
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i];
      console.log("  " + warning);
    }
    console.log();
    process.exit(1);
  }

  console.log(chalk.yellow(`Versions look good`));
};

await checkVersions();
