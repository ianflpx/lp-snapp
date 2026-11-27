#!/bin/sh
# Uma captura por vez na máquina (o Mac é compartilhado): fila com lockf, até 5 min de espera.
exec lockf -t 300 /tmp/snapp-v3-shot.lock node "$(dirname "$0")/shot.mjs" "$@"
