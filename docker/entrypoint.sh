#!/bin/sh
set -eu

PORT="${PORT:-8080}"
BACKEND_UPSTREAM="${BACKEND_UPSTREAM:-http://127.0.0.1:8888}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-/etc/nginx/conf.d/default.conf}"

cat >"${NGINX_CONF_PATH}" <<EOF
server {
  listen ${PORT};
  server_name _;

  root /usr/share/nginx/html;
  index index.html;
  client_max_body_size 25m;

  location = /health {
    access_log off;
    add_header Content-Type text/plain;
    return 200 "ok\n";
  }

  location /api/ai/ {
    proxy_pass ${BACKEND_UPSTREAM};
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600;
    proxy_send_timeout 3600;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location /api/ {
    rewrite ^/api/?(.*)$ /\$1 break;
    proxy_pass ${BACKEND_UPSTREAM};
    proxy_http_version 1.1;
    proxy_buffering off;
    proxy_read_timeout 3600;
    proxy_send_timeout 3600;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF

if [ "${RUN_NGINX:-1}" = "0" ]; then
  exit 0
fi

exec nginx -g "daemon off;"
