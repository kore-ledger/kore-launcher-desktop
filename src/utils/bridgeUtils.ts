import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from '@tauri-apps/api/path';
import { TFunction } from "i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, BaseDirectory, readFile, remove, exists, mkdir } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
// Translate errors
export function translateError(t: TFunction, errorMsg: string): string {
  if (errorMsg.includes("PKCS#5 encryption failed")) {
    return t("error.incorrectPassword");
  }
  return errorMsg;
}

// Initialize bridge with secure path
export async function initBridge(password: string): Promise<string> {
  const securePath = await path.join(await appDataDir(), 'config');
  const filePath = await path.join(securePath, 'config-node.json');
  return invoke<string>("init_bridge", { password, filePath, securePath });
}

// select file
export async function selectConfigFile(t: TFunction): Promise<string> {
  try {
    const selectedFile = await open({
      multiple: false,
      directory: false,
      filters: [
        { name: "Configuración", extensions: ["json", "yml", "yaml", "toml"] },
      ],
    });
    if (selectedFile) {
      return selectedFile as string;
    }
    throw new Error(t("error.noFileSelected"));
  } catch (err) {
    console.error("Error al seleccionar archivo:", err);
    throw new Error(t("error.fileSelection"));
  }
}

// save config files
export async function saveConfigFiles(configFile: string, configNodeFile: string) {
  const configBuffer = await readFile(configFile);
  const nodeConfigBuffer = await readFile(configNodeFile);

  const configContent = new TextDecoder().decode(configBuffer);
  const nodeConfigContent = new TextDecoder().decode(nodeConfigBuffer);
  console.log(configContent);

  await mkdir('config', {
    baseDir: BaseDirectory.AppData,
  });

  console.log("Directory created");

  await writeTextFile(await path.join("config","config.json"), configContent, {
    baseDir: BaseDirectory.AppData
  });
  console.log("File saved");
  await writeTextFile(await path.join("config","config-node.json"), nodeConfigContent, {
    baseDir: BaseDirectory.AppData
  });
  console.log("Files saved");
}

// remove all files
export async function removeAllFiles() {
  const securePath = await path.join(await appDataDir(), 'config');
  let exist = await exists(securePath);
  if (exist) {
    await remove(securePath, {
      recursive: true
    });
  }
  console.log("All files removed");
}