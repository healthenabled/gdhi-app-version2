import chalk from "chalk";
import semver from "semver";
import shelljs from "shelljs";
import { readFile } from "fs/promises";
import { execa, execaCommand, execaNode } from "execa";

const checkVersions = async () => {
  console.log(`Running predev script \n Checking versions\n`)
  const { engines } = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url)),
  );
  const versionRequirements = [
    {
      name: "node",
      currentVersion: semver.clean(process.version),
      versionRequirement: engines.node,
    },
  ]; 
  const { stdout:yarnPath } = await execa("which", ["yarn"]);
  if (!!yarnPath) {
    const { stdout } = await execa("yarn", ["--version"]);
    versionRequirements.push({
      name: "yarn",
      currentVersion:stdout,
      versionRequirement: engines.yarn,
    });
  }
  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
};

await checkVersions();
