Feature: Escáner de Archivos GitHub Action (Python)

  Como integrador de CI/CD
  Quiero que RustGuard bloquee commits maliciosos
  Para proteger el repositorio de credenciales y virus

  Scenario: Detección de token de AWS
    Given un archivo llamado "config.py" con el texto "AKIAIOSFODNN7EXAMPLE"
    When ejecuto el análisis sobre el archivo
    Then el sistema debe clasificarlo como "Credencial Expuesta"

  Scenario: Archivo Python inofensivo
    Given un archivo llamado "app.py" con el texto "def main(): pass"
    When ejecuto el análisis sobre el archivo
    Then el sistema debe clasificarlo como seguro
