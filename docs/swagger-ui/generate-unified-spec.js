#!/usr/bin/env node

/**
 * OpenAPI仕様ファイルを統合するスクリプト
 * 分割されたYAMLファイルを一つの統合ファイルにまとめます
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ベースディレクトリ
const baseDir = path.join(__dirname, '../openapi');
const outputFile = path.join(__dirname, 'openapi-unified.yaml');

console.log('OpenAPI統合スクリプトを開始します...');

try {
  // メインファイルを読み込み
  const mainSpec = yaml.load(fs.readFileSync(path.join(baseDir, 'openapi.yaml'), 'utf8'));
  
  // 統合された仕様書オブジェクト
  const unifiedSpec = {
    ...mainSpec,
    paths: {},
    components: {
      ...mainSpec.components,
      schemas: {},
      parameters: {},
      responses: {}
    }
  };

  // 共通スキーマを読み込み
  const commonSchemas = yaml.load(fs.readFileSync(path.join(baseDir, 'components/schemas/common.yaml'), 'utf8'));
  const directorySchemas = yaml.load(fs.readFileSync(path.join(baseDir, 'components/schemas/directory.yaml'), 'utf8'));
  const siteSchemas = yaml.load(fs.readFileSync(path.join(baseDir, 'components/schemas/site.yaml'), 'utf8'));
  const channelSchemas = yaml.load(fs.readFileSync(path.join(baseDir, 'components/schemas/channel.yaml'), 'utf8'));
  const resourceSchemas = yaml.load(fs.readFileSync(path.join(baseDir, 'components/schemas/resource.yaml'), 'utf8'));

  // スキーマを統合
  unifiedSpec.components.schemas = {
    ...commonSchemas,
    ...directorySchemas,
    ...siteSchemas,
    ...channelSchemas,
    ...resourceSchemas
  };

  // 共通パラメータとレスポンスを読み込み
  const commonParameters = yaml.load(fs.readFileSync(path.join(baseDir, 'components/parameters/common.yaml'), 'utf8'));
  const commonResponses = yaml.load(fs.readFileSync(path.join(baseDir, 'components/responses/common.yaml'), 'utf8'));

  unifiedSpec.components.parameters = commonParameters;
  unifiedSpec.components.responses = commonResponses;

  // パス定義を読み込み
  const directoriesPaths = yaml.load(fs.readFileSync(path.join(baseDir, 'paths/directories.yaml'), 'utf8'));
  const sitesPaths = yaml.load(fs.readFileSync(path.join(baseDir, 'paths/sites.yaml'), 'utf8'));
  const channelsPaths = yaml.load(fs.readFileSync(path.join(baseDir, 'paths/channels.yaml'), 'utf8'));
  const resourcesPaths = yaml.load(fs.readFileSync(path.join(baseDir, 'paths/resources.yaml'), 'utf8'));

  // パスを統合
  unifiedSpec.paths = {
    ...directoriesPaths,
    ...sitesPaths,
    ...channelsPaths,
    ...resourcesPaths
  };

  // 統合ファイルを出力
  const yamlOutput = yaml.dump(unifiedSpec, { 
    indent: 2,
    lineWidth: 120,
    noRefs: true
  });

  fs.writeFileSync(outputFile, yamlOutput);
  console.log(`統合されたOpenAPI仕様書を生成しました: ${outputFile}`);

} catch (error) {
  console.error('エラーが発生しました:', error.message);
  process.exit(1);
}
