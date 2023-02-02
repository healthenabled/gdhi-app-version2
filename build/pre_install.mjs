import { execa } from "execa";

const pre_install = async () => {
  const { stdout } = await execa("sh", ["./build/utils/set-up-git-hooks.sh"]);

  console.log(stdout);
};

await pre_install();
