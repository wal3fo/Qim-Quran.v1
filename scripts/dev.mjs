import { spawn } from "node:child_process";

process.env.MSYS2_ARG_CONV_EXCL = "*";

const child = spawn("next", ["dev", ...process.argv.slice(2)], { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
