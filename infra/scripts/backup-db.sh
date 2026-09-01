#!/usr/bin/env bash
# PostgreSQL (docker compose postgres-db) → gzip → S3 업로드
#
# EC2 IAM Role에 s3:PutObject (백업 prefix) 권한 필요.
#
# 사용 예:
#   COMPOSE_DIR=/home/ubuntu/janggunkitchen ./backup-db.sh
#   S3_BACKUP_BUCKET=janggun-kitchen-bucket ./backup-db.sh

set -euo pipefail

COMPOSE_DIR="${COMPOSE_DIR:-/home/ubuntu/janggunkitchen}"
S3_BUCKET="${S3_BACKUP_BUCKET:-janggun-kitchen-bucket}"
S3_PREFIX="${S3_BACKUP_PREFIX:-backups/db}"

cd "$COMPOSE_DIR"

if ! docker compose ps --status running postgres-db 2>/dev/null | grep -q postgres-db; then
  echo "ERROR: postgres-db 컨테이너가 실행 중이 아닙니다. (COMPOSE_DIR=$COMPOSE_DIR)" >&2
  exit 1
fi

POSTGRES_USER="$(docker compose exec -T postgres-db printenv POSTGRES_USER | tr -d '[:space:]')"
POSTGRES_DB="$(docker compose exec -T postgres-db printenv POSTGRES_DB | tr -d '[:space:]')"

if [[ -z "$POSTGRES_USER" || -z "$POSTGRES_DB" ]]; then
  echo "ERROR: POSTGRES_USER 또는 POSTGRES_DB를 컨테이너에서 읽지 못했습니다." >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M)"
TMP_FILE="/tmp/janggunkitchen-${STAMP}.sql.gz"
S3_URI="s3://${S3_BUCKET}/${S3_PREFIX}/${STAMP}.sql.gz"

docker compose exec -T postgres-db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip >"$TMP_FILE"
aws s3 cp "$TMP_FILE" "$S3_URI"
rm -f "$TMP_FILE"

echo "Backup uploaded: $S3_URI"
