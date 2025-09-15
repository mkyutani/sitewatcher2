# sitewatcher2

## Architecture and design

* [Design](design.md)

## API Documentation

SiteWatcher2はOpenAPI 3.0準拠のREST APIを提供しています。

### 📖 ドキュメント閲覧

#### Quick Start
```bash
# ドキュメントサーバーを起動
cd docs/swagger-ui
./serve.sh 8080

# ブラウザでアクセス
open http://localhost:8080
```

#### 利用可能なドキュメント形式
- **Swagger UI** (`docs/swagger-ui/index.html`) - インタラクティブなAPI explorer
- **Redoc** (自動生成) - クリーンで読みやすいドキュメント

### 🛠️ 開発者向け

#### 仕様書の構成
```
docs/
├── openapi/              # 分割された詳細仕様
│   ├── openapi.yaml      # メイン仕様書
│   ├── components/       # 再利用可能コンポーネント
│   │   ├── schemas/      # データモデル定義
│   │   ├── parameters/   # 共通パラメータ
│   │   └── responses/    # 共通レスポンス
│   └── paths/            # エンドポイント定義
│       ├── directories.yaml
│       ├── sites.yaml
│       ├── channels.yaml
│       └── resources.yaml
└── swagger-ui/           # ドキュメント表示
    ├── index.html
    └── openapi-simple.yaml
```

#### 仕様書の検証
```bash
# ローカル検証
./docs/validate-openapi.sh

# CI/CDでの自動検証
# GitHub Actionsで自動実行されます
```

#### 主要APIエンドポイント
- **Directories**: `/api/v1/directories` - サイト分類管理
- **Sites**: `/api/v1/sites` - 監視サイト管理  
- **Channels**: `/api/v1/channels` - 配信チャンネル管理
- **Resources**: `/api/v1/resources` - 取得リソース管理

## Backup and restore

### Backup database

```sh
#
# Backup database to sw2pg_dump.tar
#
sudo docker exec -it sw2pg sh -c 'pg_dump -Ft sitewatcher > sw2pg_dump.tar'
```

### Restore database

```sh
#
# Prepare environment for dev or production
#
sudo ./init.sh dev

#
# Start postgres server
#
sudo docker compose up -d

#
# Copy archive to /app in sw2pg container
#
sudo cp sw2pg_dump.tar volumes/pg/home

#
# Restore database from sw2pg_dump.tar
#
sudo docker exec -it sw2pg sh -c 'pg_restore -c -Ft -d sitewatcher sw2pg_dump.tar'
```
