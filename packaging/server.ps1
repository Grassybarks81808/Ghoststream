# ==============================================================
#  GHOSTSTREAM - local server (Windows)
#  A tiny zero-dependency web server that serves the Ghoststream
#  static app from this folder. No Node.js, no installs needed.
#  This file is intentionally pure ASCII so it parses correctly
#  on every Windows system and language.
# ==============================================================

$ErrorActionPreference = 'SilentlyContinue'
$port = 8420
$root = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }

$mime = @{
  '.html'       = 'text/html; charset=utf-8'
  '.js'         = 'text/javascript'
  '.mjs'        = 'text/javascript'
  '.css'        = 'text/css'
  '.png'        = 'image/png'
  '.jpg'        = 'image/jpeg'
  '.jpeg'       = 'image/jpeg'
  '.gif'        = 'image/gif'
  '.svg'        = 'image/svg+xml'
  '.webmanifest'= 'application/manifest+json'
  '.json'       = 'application/json'
  '.txt'        = 'text/plain; charset=utf-8'
  '.ico'        = 'image/x-icon'
  '.woff'       = 'font/woff'
  '.woff2'      = 'font/woff2'
  '.map'        = 'application/json'
}

$utf8 = [System.Text.Encoding]::UTF8
$rootFull = [System.IO.Path]::GetFullPath($root)

function Send-Bytes {
  param($stream, [string]$status, [string]$contentType, [byte[]]$body, [bool]$headOnly)
  $header = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
  $h = $utf8.GetBytes($header)
  $stream.Write($h, 0, $h.Length)
  if (-not $headOnly -and $body.Length -gt 0) { $stream.Write($body, 0, $body.Length) }
  $stream.Flush()
}

try {
  $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
  $listener.Start()
} catch {
  Write-Host ""
  Write-Host "  Port $port is already in use." -ForegroundColor Red
  Write-Host "  Ghoststream may already be running - check your browser tabs."
  Write-Host ""
  Start-Process "http://localhost:$port/"
  exit
}

Write-Host ""
Write-Host "  G H O S T S T R E A M" -ForegroundColor Red
Write-Host "  ---------------------" -ForegroundColor DarkGray
Write-Host "  Free movies. Zero ads. Public domain forever."
Write-Host ""
Write-Host "  Serving : $rootFull"
Write-Host "  App     : " -NoNewline
Write-Host "http://localhost:$port/" -ForegroundColor Yellow
Write-Host "  Quit    : press Ctrl+C (or close this window)"
Write-Host ""

Start-Process "http://localhost:$port/"

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $stream.ReadTimeout = 5000
    $reader = New-Object System.IO.StreamReader($stream, $utf8)

    $requestLine = $reader.ReadLine()
    if (-not $requestLine) { $client.Close(); continue }

    # drain headers
    while ($true) {
      $line = $reader.ReadLine()
      if ($null -eq $line -or $line -eq '') { break }
    }

    $parts = $requestLine.Split(' ')
    if ($parts.Length -lt 2) { $client.Close(); continue }
    $method = $parts[0].ToUpper()
    $rawPath = $parts[1]
    $path = [Uri]::UnescapeDataString(($rawPath -split '\?')[0])
    if ($path.EndsWith('/')) { $path = $path + 'index.html' }
    $path = $path.TrimStart('/')

    $file = [System.IO.Path]::GetFullPath((Join-Path $root $path))

    # block path traversal
    if (-not $file.StartsWith($rootFull)) {
      Send-Bytes $stream '403 Forbidden' 'text/plain' ($utf8.GetBytes('forbidden')) ($method -eq 'HEAD')
      $client.Close(); continue
    }

    # SPA fallback: unknown paths serve the app shell
    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
      $file = Join-Path $root 'index.html'
    }

    if (Test-Path -LiteralPath $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      Send-Bytes $stream '200 OK' $ct $bytes ($method -eq 'HEAD')
    } else {
      Send-Bytes $stream '404 Not Found' 'text/plain' ($utf8.GetBytes('not found')) ($method -eq 'HEAD')
    }
  } catch {
    # a bad request should never take the server down
  } finally {
    $client.Close()
  }
}
