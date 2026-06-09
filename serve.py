#!/usr/bin/env python3
"""
HTTP server with byte-range request support — required for video seeking.
Usage: python3 serve.py [port]
Default port: 8000
"""
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import mimetypes
import email.utils
import time


class RangeHTTPRequestHandler(BaseHTTPRequestHandler):
    """Serves files with HTTP Range request support so video seeking works."""

    def do_GET(self):
        self._serve("GET")

    def do_HEAD(self):
        self._serve("HEAD")

    def _serve(self, method):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            for index in ("index.html", "index.htm"):
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    path = index_path
                    break
            else:
                self.send_error(404, "No index file found")
                return

        if not os.path.isfile(path):
            self.send_error(404, "File not found")
            return

        ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
        file_size = os.path.getsize(path)

        range_header = self.headers.get("Range")
        if range_header:
            # Parse "bytes=start-end"
            try:
                unit, ranges = range_header.split("=", 1)
                if unit.strip() != "bytes":
                    raise ValueError("Unsupported range unit")
                start_str, end_str = ranges.strip().split("-", 1)
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1
                end = min(end, file_size - 1)
            except Exception:
                self.send_error(416, "Range Not Satisfiable")
                return

            if start > end or start >= file_size:
                self.send_error(416, "Range Not Satisfiable")
                return

            content_length = end - start + 1
            self.send_response(206)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(content_length))
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()

            if method == "GET":
                with open(path, "rb") as f:
                    f.seek(start)
                    remaining = content_length
                    while remaining:
                        chunk = f.read(min(65536, remaining))
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        remaining -= len(chunk)
        else:
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()

            if method == "GET":
                with open(path, "rb") as f:
                    while True:
                        chunk = f.read(65536)
                        if not chunk:
                            break
                        self.wfile.write(chunk)

    def translate_path(self, path):
        path = path.split("?", 1)[0].split("#", 1)[0]
        parts = path.split("/")
        safe_parts = [p for p in parts if p and p != ".." and p != "."]
        return os.path.join(os.getcwd(), *safe_parts) if safe_parts else os.getcwd()

    def log_message(self, fmt, *args):
        # Suppress noisy per-request logs; only show errors
        if int(args[1]) >= 400:
            super().log_message(fmt, *args)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = HTTPServer(("", port), RangeHTTPRequestHandler)
    print(f"Serving on http://localhost:{port}  (with byte-range support)")
    print("Press Ctrl-C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
