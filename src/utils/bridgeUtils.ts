import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from '@tauri-apps/api/path';
import { TFunction } from "i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, BaseDirectory, readFile} from '@tauri-apps/plugin-fs';
// Translate errors
export function translateError(t: TFunction, errorMsg: string): string {
    if (errorMsg.includes("PKCS#5 encryption failed")) {
        return t("error.incorrectPassword");
    }
    return errorMsg;
}

// Initialize bridge with secure path
export async function initBridge(password: string, filePath: string): Promise<string> {
    const securePath = await appDataDir();
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
export async function saveConfigFiles(configFile: string, configNodeFile: string): Promise<void> {
    const securePath = await appDataDir();

    const configBuffer = await readFile(configFile);
    const nodeConfigBuffer = await readFile(configNodeFile);
    
    const configContent = new TextDecoder().decode(configBuffer);
    const nodeConfigContent = new TextDecoder().decode(nodeConfigBuffer);
    console.log(configContent);

    await writeTextFile( `${securePath}/config.json`,configContent);
    await writeTextFile( `${securePath}/config-node.json`, nodeConfigContent);
}