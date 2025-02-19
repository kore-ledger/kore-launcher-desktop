# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Build web

```bash
npm run build    
```

```bash
npx vite preview
```

## Build in macos | window

```bash
# Depends on host platform
npm run tauri build 
```

## Build in android

```bash
# Importante seleccionar la arquitectura correcta del android
 npm run tauri android build -- --apk --target aarch64  
```

```bash
/Users/josephgabino/Library/Android/sdk/build-tools/34.0.0/apksigner sign \--ks ~/my-release-key.jks \--ks-key-alias my-key-alias \
--out /Users/josephgabino/Desktop/KORE-LEDGER/mongoo/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-signed.apk \
/Users/josephgabino/Desktop/KORE-LEDGER/mongoo/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk
```

```bash
 /Users/josephgabino/Library/Android/sdk/build-tools/34.0.0/zipalign -v 4 \ 
/Users/josephgabino/Desktop/KORE-LEDGER/mongoo/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-signed.apk \                           
/Users/josephgabino/Desktop/KORE-LEDGER/mongoo/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-final.apk
```

```bash
 adb install -r /Users/josephgabino/Desktop/KORE-LEDGER/mongoo/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-signed.apk
```


```bash
brew install openssl
brew install pkg-config
echo 'export OPENSSL_DIR=$(brew --prefix openssl)' >> ~/.zshrc
echo 'export OPENSSL_LIB_DIR=$OPENSSL_DIR/lib' >> ~/.zshrc
echo 'export OPENSSL_INCLUDE_DIR=$OPENSSL_DIR/include' >> ~/.zshrc
echo 'export PKG_CONFIG_PATH=$OPENSSL_DIR/lib/pkgconfig' >> ~/.zshrc
source ~/.zshrc
```