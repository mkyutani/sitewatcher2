# SiteWatcher2 API Documentation (Swagger UI)

このディレクトリには、SiteWatcher2 APIのSwagger UIベースのドキュメントが含まれています。

## ファイル構成

- `index.html` - Swagger UIのメインHTMLファイル
- `openapi-simple.yaml` - 簡易版OpenAPI仕様書（主要エンドポイントのみ）
- `generate-unified-spec.js` - 完全版統合スクリプト（将来用）

## 使用方法

### 1. ローカルHTTPサーバーで表示

以下のいずれかの方法でローカルサーバーを起動してください：

#### Python (Python 3)
```bash
cd docs/swagger-ui
python -m http.server 8080
```

#### Python (Python 2)
```bash
cd docs/swagger-ui
python -m SimpleHTTPServer 8080
```

#### Node.js (npx)
```bash
cd docs/swagger-ui
npx http-server -p 8080
```

#### PHP
```bash
cd docs/swagger-ui
php -S localhost:8080
```

### 2. ブラウザでアクセス

```
http://localhost:8080
```

### 3. VS Code Live Server Extension

VS Codeで`index.html`を開き、Live Server拡張機能を使用して表示することも可能です。

## API操作のテスト

1. Swagger UIが表示されたら、「Try it out」ボタンをクリック
2. パラメータを入力
3. 「Execute」ボタンでAPIをテスト

**注意**: 実際のAPIサーバーが起動している必要があります。
- APIサーバー: `http://localhost:8089`（デフォルト）

## 完全版仕様書

現在の`openapi-simple.yaml`は主要エンドポイントのみを含む簡易版です。
全54個のエンドポイントを含む完全版は、`../openapi/`ディレクトリの分割ファイルで管理されています。

### 分割ファイル構成

```
../openapi/
├── openapi.yaml              # メイン仕様書
├── components/
│   ├── schemas/              # データモデル定義
│   ├── parameters/           # 共通パラメータ
│   ├── responses/            # 共通レスポンス
│   └── examples/             # リクエスト/レスポンス例
└── paths/                    # エンドポイント別定義
    ├── directories.yaml
    ├── sites.yaml
    ├── channels.yaml
    └── resources.yaml
```

## トラブルシューティング

### CORS エラー

ローカルファイルを直接ブラウザで開くとCORSエラーが発生する場合があります。
必ずHTTPサーバー経由でアクセスしてください。

### API サーバー接続エラー

- SiteWatcher2 APIサーバーが起動していることを確認
- `docker-compose up -d` でAPIサーバーを起動
- ポート番号が正しいことを確認（デフォルト: 8089）
