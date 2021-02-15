import pathLib from "path"
import fs from "fs-extra"

export async function detectGameVersion(directory: string): Promise<string> {
  const content = await fs.readFile(
    pathLib.resolve(directory, "./Among Us_Data/globalgamemanagers"),
    { encoding: "utf8" }
  )

  const regex = /\d{4}\.\d{1,4}\.\d{1,4}/gu
  regex.exec(content)
  const match = regex.exec(content)

  if (match !== null) {
    return match[0]
  }

  throw new Error("Among Us version could not be detected")
}
