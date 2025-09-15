#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
SiteWatcher2 API Documentation Server
YAML MIME type対応のHTTPサーバー
"""

import http.server
import socketserver
import mimetypes
import sys
import os

# YAML ファイルのMIME typeを追加
mimetypes.add_type('application/x-yaml', '.yaml')
mimetypes.add_type('application/x-yaml', '.yml')
mimetypes.add_type('text/yaml', '.yaml')
mimetypes.add_type('text/yaml', '.yml')

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """CORS対応のHTTPRequestHandler"""
    
    def end_headers(self):
        # CORS ヘッダーを追加
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        super().end_headers()
    
    def do_OPTIONS(self):
        """OPTIONS リクエストの処理"""
        self.send_response(200)
        self.end_headers()
    
    def guess_type(self, path):
        """ファイルタイプの推測（YAML対応強化）"""
        mimetype, encoding = mimetypes.guess_type(path)
        
        # YAML ファイルの場合は明示的に設定
        if path.endswith('.yaml') or path.endswith('.yml'):
            return 'application/x-yaml', encoding
        
        return mimetype, encoding

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    
    print("===================================")
    print("SiteWatcher2 API Documentation")
    print("===================================")
    print(f"Starting CORS-enabled HTTP server on port {port}...")
    print(f"Access URL: http://localhost:{port}")
    print("YAML MIME type support: ✓")
    print("CORS support: ✓")
    print("Press Ctrl+C to stop the server")
    print("===================================")
    
    # カレントディレクトリを設定
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        print(f"Error: {e}")
        print(f"Port {port} may already be in use. Try a different port:")
        print(f"python3 server.py {port + 1}")

if __name__ == "__main__":
    main()
