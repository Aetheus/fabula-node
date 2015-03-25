$env:DATABASE_URL = &"heroku" config:get DATABASE_URL -a fabula-node | Out-String
Write-host "DATABASE_URL has been set to: $env:DATABASE_URL"
node .\bin\www