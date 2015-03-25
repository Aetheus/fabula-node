$env:DATABASE_URL = &"heroku" pg:credentials DATABASE | Out-String
$env:DATABASE_URL | Out-File .\database_url.txt
$env:DATABASE_URL = (Get-Content .\database_url.txt)[3]

$string = $env:DATABASE_URL
$string = $string.Trim(" ", "`"") + "?sslmode=require"

$env:DATABASE_URL = $string

Write-host "DATABASE_URL has been set to: $env:DATABASE_URL"
node .\bin\www