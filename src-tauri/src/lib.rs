use kore_bridge::{
    clap::Parser,
    settings::{build_config, build_file_path, build_password, command::Args},
    Bridge,
  };
  use tokio::sync::OnceCell;
  use tauri::{State, Manager};
  
  /// Contenedor para la instancia de Bridge.
  struct BridgeState(OnceCell<Bridge>);
  
  impl Default for BridgeState {
    fn default() -> Self {
      BridgeState(OnceCell::const_new())
    }
  }
  
  /// Inicializa el Bridge y lo almacena en el estado de Tauri.
  #[tauri::command]
  async fn init_bridge(
    state: State<'_, BridgeState>,
    password: String,
    file_path: String,
  ) -> Result<String, String> {
    println!("Initializing Bridge");
    println!("Password: {}", password);
    println!("File Path: {}", file_path);
  
    let args = Args::parse();
    let file_path = if file_path.is_empty() {
      build_file_path()
    } else {
      file_path
    };
    let password = if password.is_empty() {
      build_password()
    } else {
      password
    };
  
    let config = build_config(args.env_config, &file_path);
    let bridge = Bridge::build(config, &password, None)
      .await
      .map_err(|e| format!("Error building Bridge: {:?}", e))?;
  
    // Intentamos establecer la instancia. Si ya se configuró, devolvemos un error.
    if state.0.set(bridge).is_err() {
      return Err("Bridge ya ha sido inicializado".to_string());
    }
  
    Ok("Bridge initialized successfully".to_string())
  }
  
  /// Retorna el peer_id del Bridge almacenado en el estado.
  #[tauri::command]
  async fn get_peer_id(state: State<'_, BridgeState>) -> Result<String, String> {
    let bridge = state.0.get().ok_or("Bridge not initialized")?;
    Ok(bridge.peer_id())
  }
  
  /// Detiene el Bridge (por ejemplo, cancelando su token).
  #[tauri::command]
  async fn stop_bridge(state: State<'_, BridgeState>) -> Result<String, String> {
    let bridge = state.0.get().ok_or("Bridge not initialized")?;
    bridge.token().cancel();
    Ok("Bridge stopped successfully".to_string())
  }
  
  #[cfg_attr(mobile, tauri::mobile_entry_point)]
  pub fn run() {
    tauri::Builder::default()
      // Se inyecta el estado global de la aplicación.
      .manage(BridgeState::default())
      .plugin(tauri_plugin_dialog::init())
      .plugin(tauri_plugin_opener::init())
      .invoke_handler(tauri::generate_handler![init_bridge, get_peer_id, stop_bridge])
      .on_window_event(|window, event| {
        if let tauri::WindowEvent::CloseRequested { .. } = event {
          println!("Cerrando aplicación, deteniendo Bridge...");
          let app_handle = window.app_handle();
          let state = app_handle.state::<BridgeState>();
          if let Some(bridge) = state.0.get() {
            bridge.token().cancel();
          }
        }
      })
      
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  
    println!("Tauri app running");
  }
  
  