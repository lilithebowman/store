#!/bin/bash

# Coverage Check Script
# This script runs tests with coverage and checks if thresholds are met

echo "🧪 Running comprehensive test coverage check..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_status "error" "npm is not installed or not in PATH"
    exit 1
fi

print_status "info" "Installing dependencies..."
npm ci --silent && npm ci --prefix client --silent

if [ $? -ne 0 ]; then
    print_status "error" "Failed to install dependencies"
    exit 1
fi

print_status "info" "Running client tests with coverage..."
npm run client:test -- --coverage --watchAll=false --silent

CLIENT_EXIT_CODE=$?

print_status "info" "Running server tests with coverage..."
npm run test:coverage:ci --silent

SERVER_EXIT_CODE=$?

# Check if coverage files exist
if [ -f "client/coverage/lcov-report/index.html" ]; then
    print_status "success" "Client coverage report generated: client/coverage/lcov-report/index.html"
else
    print_status "warning" "Client coverage report not found"
fi

# Parse coverage summary if available
if [ -f "client/coverage/coverage-summary.json" ]; then
    print_status "info" "Coverage Summary:"
    echo "=================="
    node -e "
        const fs = require('fs');
        const coverage = JSON.parse(fs.readFileSync('client/coverage/coverage-summary.json', 'utf8'));
        const total = coverage.total;
        
        console.log('📊 Coverage Metrics:');
        console.log(\`   Statements: \${total.statements.pct}% (\${total.statements.covered}/\${total.statements.total})\`);
        console.log(\`   Branches:   \${total.branches.pct}% (\${total.branches.covered}/\${total.branches.total})\`);
        console.log(\`   Functions:  \${total.functions.pct}% (\${total.functions.covered}/\${total.functions.total})\`);
        console.log(\`   Lines:      \${total.lines.pct}% (\${total.lines.covered}/\${total.lines.total})\`);
        
        const thresholds = {
            statements: 75,
            branches: 70,
            functions: 75,
            lines: 75
        };
        
        let allMet = true;
        Object.keys(thresholds).forEach(key => {
            if (total[key].pct < thresholds[key]) {
                console.log(\`❌ \${key}: \${total[key].pct}% < \${thresholds[key]}% (threshold not met)\`);
                allMet = false;
            }
        });
        
        if (allMet) {
            console.log('✅ All coverage thresholds met!');
        } else {
            console.log('❌ Some coverage thresholds not met');
            process.exit(1);
        }
    "
fi

COVERAGE_EXIT_CODE=$?

# Final status
echo ""
echo "=============================================="
if [ $CLIENT_EXIT_CODE -eq 0 ] && [ $COVERAGE_EXIT_CODE -eq 0 ]; then
    print_status "success" "All tests passed and coverage thresholds met!"
    echo ""
    echo "📂 View detailed coverage report: client/coverage/lcov-report/index.html"
    echo "🔍 To open in browser: open client/coverage/lcov-report/index.html"
    exit 0
else
    print_status "error" "Tests failed or coverage thresholds not met"
    echo ""
    echo "💡 Tips to improve coverage:"
    echo "   - Add tests for uncovered functions and branches"
    echo "   - Test error handling paths"
    echo "   - Test edge cases and conditional logic"
    echo "   - Consider integration tests for complex flows"
    exit 1
fi
