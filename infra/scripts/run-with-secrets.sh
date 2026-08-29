#!/bin/bash
# AWS Secrets Manager에서 시크릿을 가져와 환경 변수로 export 한 뒤 Spring Boot JAR 실행.
# 사용법: SECRET_NAME=janggunkitchen/dev APP_JAR=/path/to/app.jar ./run-with-secrets.sh

set -e

SECRET_NAME="${SECRET_NAME:-janggunkitchen/dev}"
SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-dev}"
APP_JAR="${APP_JAR}"

if [ -z "$APP_JAR" ]; then
  echo "ERROR: APP_JAR 환경 변수를 설정하세요. 예: APP_JAR=/path/to/app.jar" >&2
  exit 1
fi

if [ ! -f "$APP_JAR" ]; then
  echo "ERROR: JAR 파일을 찾을 수 없습니다: $APP_JAR" >&2
  exit 1
fi

# Secrets Manager에서 JSON 가져와서 export (jq 필요)
eval "$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --query SecretString --output text | jq -r 'to_entries | map("export \(.key)=\(.value | @sh)") | .[]')"

export SPRING_PROFILES_ACTIVE
exec java -jar "$APP_JAR"
