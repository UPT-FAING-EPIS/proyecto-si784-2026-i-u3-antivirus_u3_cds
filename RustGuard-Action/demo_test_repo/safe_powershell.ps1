# Script PowerShell seguro para listar archivos
Get-ChildItem -Path "C:\Users" -Recurse -Filter "*.txt" | Select-Object Name, Length
Write-Host "Listado completo de archivos de texto"
