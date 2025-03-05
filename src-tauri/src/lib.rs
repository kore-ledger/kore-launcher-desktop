use std::env;
use kore_bridge::{
    clap::Parser,
    settings::{build_config, build_file_path, build_password, command::Args},
    Bridge,
};
use log::LevelFilter;
use serde::Deserialize;
use tauri::{Manager, State};
use tokio::{fs, sync::OnceCell};

#[derive(Debug, Deserialize)]
struct Config {
    governance_id: String,
    witness: Vec<String>,
}
/// Contenedor para la instancia de Bridge y las rutas de configuración.
struct BridgeState {
    bridge: OnceCell<Bridge>,
    config: OnceCell<Vec<Config>>,
}

impl Default for BridgeState {
    fn default() -> Self {
        BridgeState {
            bridge: OnceCell::const_new(),
            config: OnceCell::const_new(),
        }
    }
}

/// Inicializa el Bridge y almacena en el estado la instancia y las rutas de configuración.
#[tauri::command]
async fn init_bridge(
    state: State<'_, BridgeState>,
    password: String,
    node_path: String,
    config_path: String,
    secure_path: String,
) -> Result<String, String> {
    println!("Initializing Bridge");
    println!("Password: {}", password);
    println!("File Path: {}", node_path);

    let args = Args::parse();
    let node_path = if node_path.is_empty() {
        build_file_path()
    } else {
        node_path
    };
    let password = if password.is_empty() {
        build_password()
    } else {
        password
    };

    let mut config = build_config(args.env_config, &node_path)
        .map_err(|e| format!("Error building config: {:?}", e))?;

    // Secure path
    config.kore_config.add_path(secure_path.as_str());
    config.keys_path = format!("{}/{}", secure_path, config.keys_path);
    println!("Config: {:?}", config);

    // Inicialización del Bridge
    let bridge = Bridge::build(config, &password, None)
        .await
        .map_err(|e| format!("Error building Bridge: {:?}", e))?;

    // Almacenar el Bridge en el estado (única instancia)
    if state.bridge.set(bridge).is_err() {
        return Err("Bridge ya ha sido inicializado".to_string());
    }

    // Almacenar configuración en el estado
    let data = fs::read_to_string(config_path).await.map_err(|e| e.to_string())?;
    let auth_data: Vec<Config> = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    if state.config.set(auth_data).is_err() {
        return Err("Config ya ha sido inicializado".to_string());
    }

    Ok("Bridge initialized successfully".to_string())
}

#[tauri::command]
async fn get_config_governance_ids(state: State<'_, BridgeState>) -> Result<Vec<String>, String> {
    let config = state.config.get().ok_or("Config not initialized")?;
    // iteramos para obtener todas las gobernanzas
    Ok(config.iter().map(|g| g.governance_id.clone()).collect::<Vec<String>>())
}

#[tauri::command]
async fn get_all_governance_ids(state: State<'_, BridgeState>) -> Result<Vec<String>, String> {
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    let govs = bridge.get_all_govs(Some(true))
        .await
        .map_err(|e| e.to_string())?;
    let governance_ids = govs.into_iter()
        .map(|gov| gov.governance_id)
        .collect();
    Ok(governance_ids)
}

#[tauri::command]
async fn update_governance(state: State<'_, BridgeState>, governance: String) -> Result<String, String> {
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    bridge.update_subject(governance).await.map_err(|e| e.to_string())
}
/// Retorna el peer_id del Bridge almacenado en el estado.
#[tauri::command]
async fn get_peer_id(state: State<'_, BridgeState>) -> Result<String, String> {
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    Ok(bridge.peer_id())
}

#[tauri::command]
async fn get_controller_id(state: State<'_, BridgeState>) -> Result<String, String> {
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    Ok(bridge.controller_id())
}

#[tauri::command]
async fn get_auth(state: State<'_, BridgeState>, governance: String) -> Result<Vec<String>, String> {
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    bridge.get_witnesses_subject(governance).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn put_auth(
    state: State<'_, BridgeState>,
    governance: String,
) -> Result<String, String> {
    log::info!("put_authhhhhh");
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    let config = state.config.get().ok_or("Config not initialized")?;
    // search governance in config
    let governance = config.iter().find(|g| g.governance_id == governance).ok_or("Gobernanza no encontrada")?;
    bridge.put_auth_subject(governance.governance_id.clone(), governance.witness.clone()).await.map_err(|e| e.to_string())
}

/// Detiene el Bridge (por ejemplo, cancelando su token).
#[tauri::command]
async fn stop_bridge(state: State<'_, BridgeState>) -> Result<String, String> {
    let bridge = state.bridge.get().ok_or("Bridge not initialized")?;
    bridge.token().cancel();
    Ok("Bridge stopped successfully".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .max_file_size(50 * 1024 * 1024)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .level(LevelFilter::Info)
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("logs".to_string()),
                    },
                ))
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .manage(BridgeState::default())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            init_bridge,
            get_peer_id,
            stop_bridge,
            get_auth,
            put_auth,
            get_all_governance_ids,
            get_config_governance_ids,
            update_governance,
            get_controller_id
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                println!("Cerrando aplicación, deteniendo Bridge...");
                let app_handle = window.app_handle();
                let state = app_handle.state::<BridgeState>();
                if let Some(bridge) = state.bridge.get() {
                    bridge.token().cancel();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("Tauri app running");
}
