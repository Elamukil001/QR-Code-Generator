# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Python command failed"
    }
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
}
catch {
    try {
        # Try 'py' launcher if 'python' fails
        $pythonVersion = py --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Found Python Launcher: $pythonVersion" -ForegroundColor Green
            $env:PYTHON_CMD = "py"
        } else {
            throw
        }
    }
    catch {
        Write-Host "Error: Python is not installed or not in your PATH." -ForegroundColor Red
        Write-Host "Please install Python from https://www.python.org/downloads/ and check 'Add Python to PATH' during installation." -ForegroundColor Yellow
        exit 1
    }
}

$pythonCmd = if ($env:PYTHON_CMD) { $env:PYTHON_CMD } else { "python" }

# Install requirements
Write-Host "Installing requirements..." -ForegroundColor Cyan
& $pythonCmd -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install requirements." -ForegroundColor Red
    exit 1
}

# Run the app
Write-Host "Starting application..." -ForegroundColor Cyan
Write-Host "Opening http://127.0.0.1:5000 in your browser..." -ForegroundColor Cyan
Start-Process "http://127.0.0.1:5000"
& $pythonCmd app.py
