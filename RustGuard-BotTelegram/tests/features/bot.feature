Feature: Bot de Telegram Sandbox

  Como administrador del bot
  Quiero que analice los outputs de ClamAV
  Para alertar o calmar al usuario sobre el archivo subido

  Scenario: Detección de malware por ClamAV
    Given que el motor antivirus devuelve el string "/tmp/file.pdf: Trojan.Malware FOUND"
    When el bot procesa el resultado del análisis
    Then debe detectar el virus "Trojan.Malware"

  Scenario: Archivo limpio por ClamAV
    Given que el motor antivirus devuelve el string "/tmp/file.pdf: OK"
    When el bot procesa el resultado del análisis
    Then debe retornar que el archivo es seguro
