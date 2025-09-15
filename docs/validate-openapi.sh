#!/bin/bash

# OpenAPI仕様書ローカル検証スクリプト
# Usage: ./docs/validate-openapi.sh

set -e

echo "========================================"
echo "SiteWatcher2 OpenAPI Validation Script"
echo "========================================"

# カレントディレクトリを確認
if [ ! -f "docs/openapi/openapi.yaml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: docs/openapi/openapi.yaml"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo ""

# 必要なツールの確認とインストール
echo "🔧 Checking required tools..."

check_and_install_tool() {
    local tool=$1
    local npm_package=$2
    
    if ! command -v $tool &> /dev/null; then
        echo "⚠️  $tool not found. Installing..."
        if command -v npm &> /dev/null; then
            npm install -g $npm_package
        else
            echo "❌ npm not found. Please install Node.js and npm first."
            exit 1
        fi
    else
        echo "✅ $tool found"
    fi
}

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

check_and_install_tool "swagger-parser" "@apidevtools/swagger-parser"
check_and_install_tool "spectral" "@stoplight/spectral-cli"

echo ""

# 1. YAML構文チェック
echo "1️⃣  YAML Syntax Validation"
echo "----------------------------"

validate_yaml() {
    local file=$1
    if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
        echo "✅ $file"
        return 0
    else
        echo "❌ $file - Invalid YAML syntax"
        return 1
    fi
}

yaml_errors=0

echo "Checking OpenAPI YAML files..."
for file in docs/openapi/**/*.yaml docs/swagger-ui/*.yaml; do
    if [ -f "$file" ]; then
        validate_yaml "$file" || ((yaml_errors++))
    fi
done

if [ $yaml_errors -gt 0 ]; then
    echo "❌ Found $yaml_errors YAML syntax errors"
    exit 1
fi

echo ""

# 2. OpenAPI仕様書検証
echo "2️⃣  OpenAPI Specification Validation"
echo "--------------------------------------"

echo "Validating simplified OpenAPI spec..."
if swagger-parser validate docs/swagger-ui/openapi-simple.yaml; then
    echo "✅ OpenAPI specification is valid"
else
    echo "❌ OpenAPI specification validation failed"
    exit 1
fi

echo ""

# 3. Spectral Linting
echo "3️⃣  Spectral Linting"
echo "---------------------"

# Spectral設定ファイルを作成（一時的）
cat > .spectral.tmp.yml << 'EOF'
extends: ["@stoplight/spectral/dist/rulesets/oas/index.js"]
rules:
  operation-operationId: true
  operation-summary: true
  operation-description: true
  operation-tag-defined: true
  path-params: true
  contact-properties: false
  license-url: false
  no-$ref-siblings: true
  oas3-api-servers: true
  oas3-examples-value-or-externalValue: true
  oas3-operation-security-defined: false
  oas3-server-trailing-slash: true
  oas3-valid-media-type: true
  oas3-valid-schema-example: true
  openapi-tags: true
  tag-description: false
EOF

echo "Running Spectral linting..."
if spectral lint docs/swagger-ui/openapi-simple.yaml --ruleset .spectral.tmp.yml --fail-severity=error; then
    echo "✅ Spectral linting passed"
else
    echo "❌ Spectral linting failed"
    rm -f .spectral.tmp.yml
    exit 1
fi

# 一時ファイルを削除
rm -f .spectral.tmp.yml

echo ""

# 4. ドキュメント生成テスト
echo "4️⃣  Documentation Generation Test"
echo "-----------------------------------"

echo "Testing Swagger UI accessibility..."
if [ -f "docs/swagger-ui/index.html" ] && [ -f "docs/swagger-ui/openapi-simple.yaml" ]; then
    echo "✅ Swagger UI files present"
else
    echo "❌ Swagger UI files missing"
    exit 1
fi

# Redocがインストールされている場合はRedocドキュメント生成もテスト
if command -v redoc-cli &> /dev/null; then
    echo "Testing Redoc documentation generation..."
    if redoc-cli build docs/swagger-ui/openapi-simple.yaml --output /tmp/test-redoc.html --title "Test"; then
        echo "✅ Redoc generation successful"
        rm -f /tmp/test-redoc.html
    else
        echo "❌ Redoc generation failed"
        exit 1
    fi
else
    echo "ℹ️  Redoc not installed (optional)"
fi

echo ""

# 5. 統計情報
echo "5️⃣  Documentation Statistics"
echo "------------------------------"

python3 << 'EOF'
import yaml
import os

# 簡易版の統計
with open('docs/swagger-ui/openapi-simple.yaml', 'r') as f:
    simple_spec = yaml.safe_load(f)

print(f"📊 API Documentation Statistics:")
print(f"   Paths: {len(simple_spec.get('paths', {}))}")
print(f"   Schemas: {len(simple_spec.get('components', {}).get('schemas', {}))}")
print(f"   Tags: {len(simple_spec.get('tags', []))}")

# 分割ファイルの統計
openapi_files = []
for root, dirs, files in os.walk('docs/openapi'):
    for file in files:
        if file.endswith('.yaml'):
            openapi_files.append(os.path.join(root, file))

print(f"   OpenAPI files: {len(openapi_files)}")

# ファイルサイズ
simple_size = os.path.getsize('docs/swagger-ui/openapi-simple.yaml')
print(f"   Simple spec size: {simple_size} bytes")
EOF

echo ""

# 6. 推奨事項
echo "6️⃣  Recommendations"
echo "--------------------"

echo "✅ All validations passed!"
echo ""
echo "🚀 Next steps:"
echo "   1. Start documentation server: cd docs/swagger-ui && ./serve.sh"
echo "   2. View documentation: http://localhost:8080"
echo "   3. Test API endpoints with Swagger UI"
echo "   4. Commit changes and push to trigger CI/CD"
echo ""
echo "📝 Development workflow:"
echo "   - Edit files in docs/openapi/ for detailed specifications"
echo "   - Update docs/swagger-ui/openapi-simple.yaml for quick testing"
echo "   - Run this script before committing changes"
echo "   - Use GitHub Actions for automated validation"
echo ""

echo "========================================="
echo "✅ OpenAPI Validation Complete!"
echo "========================================="
