import { AxiosResponse } from "axios";
import chalk from "chalk";
import { access, mkdir, writeFile } from "node:fs/promises";
import { Stream } from "node:stream";

export const writeToFile = (path: string) => {
  return (content: string | Stream | Buffer) => writeFile(path, content);
};

export const toText = (res: AxiosResponse<string, any>) => res.data;

export const checkTypeVersion = (
  loggerPrefix: string,
  typeVersion: string,
  codeVersion: string
) => {
  if (typeVersion.includes(codeVersion) || codeVersion.includes(typeVersion)) {
    console.log(chalk.green(`[${loggerPrefix}] type version: ${typeVersion}`));
    console.log(chalk.green(`[${loggerPrefix}] code version: ${codeVersion}`));
  } else {
    console.log(
      chalk.red(
        `[${loggerPrefix}] warning: type package version not match code version`
      )
    );
    console.log(chalk.green(`[${loggerPrefix}] type version: ${typeVersion}`));
    console.log(chalk.green(`[${loggerPrefix}] code version: ${typeVersion}`));
  }
};

export const createIfNotExist = async (path: string) => {
  try {
    await access(path);
  } catch (error) {
    await mkdir(path, { recursive: true });
  }
};
