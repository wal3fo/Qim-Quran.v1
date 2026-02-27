import { spawnSync } from "node:child_process";

process.env.MSYS2_ARG_CONV_EXCL = "*";

const result = spawnSync("next", ["build"], { stdio: "inherit", shell: true });
process.exit(result.status ?? 1);
