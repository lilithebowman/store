#!/bin/bash
# Script to generate favicon.ico from shopping cart emoji

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Create temporary HTML file with the shopping cart emoji
cat > "$TEMP_DIR/emoji.html" << EOF
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-size: 192px;
      text-align: center;
      margin: 0;
      padding: 50px;
      background: transparent;
    }
  </style>
</head>
<body>
  🛒
</body>
</html>
EOF

echo "Created emoji HTML file"

# Check if required tools are installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first."
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "On CentOS/RHEL: sudo yum install imagemagick"
    echo "On macOS with Homebrew: brew install imagemagick"
    exit 1
fi

# Method 1: Using wkhtmltoimage if available
if command -v wkhtmltoimage &> /dev/null; then
    echo "Using wkhtmltoimage to render emoji..."
    wkhtmltoimage --transparent --quality 100 "$TEMP_DIR/emoji.html" "$TEMP_DIR/cart.png"
# Method 2: Using Chrome/Chromium headless if available
elif command -v chromium &> /dev/null || command -v chromium-browser &> /dev/null || command -v google-chrome &> /dev/null; then
    CHROME_CMD=""
    if command -v chromium &> /dev/null; then
        CHROME_CMD="chromium"
    elif command -v chromium-browser &> /dev/null; then
        CHROME_CMD="chromium-browser"
    else
        CHROME_CMD="google-chrome"
    fi
    echo "Using $CHROME_CMD to render emoji..."
    $CHROME_CMD --headless --screenshot="$TEMP_DIR/cart.png" --window-size=256,256 --default-background-color=0 "file://$TEMP_DIR/emoji.html"
# Method 3: Using Firefox headless if available
elif command -v firefox &> /dev/null; then
    echo "Using Firefox to render emoji..."
    firefox --headless --screenshot "$TEMP_DIR/cart.png" "file://$TEMP_DIR/emoji.html"
else
    echo "No suitable browser found for rendering the emoji."
    echo "Creating a solid-color icon instead..."
    # Create a simple cart-like shape with ImageMagick
    convert -size 256x256 xc:transparent -fill "#3498db" -draw "rectangle 50,100 200,200" -draw "circle 75,220 75,240" -draw "circle 175,220 175,240" "$TEMP_DIR/cart.png"
fi

echo "Converting to favicon.ico..."

# Create favicon.ico with multiple sizes (16x16, 32x32, 48x48, 64x64)
convert "$TEMP_DIR/cart.png" -background transparent -resize 16x16 "$TEMP_DIR/favicon-16.png"
convert "$TEMP_DIR/cart.png" -background transparent -resize 32x32 "$TEMP_DIR/favicon-32.png"
convert "$TEMP_DIR/cart.png" -background transparent -resize 48x48 "$TEMP_DIR/favicon-48.png"
convert "$TEMP_DIR/cart.png" -background transparent -resize 64x64 "$TEMP_DIR/favicon-64.png"

# Combine all sizes into a single .ico file
convert "$TEMP_DIR/favicon-16.png" "$TEMP_DIR/favicon-32.png" "$TEMP_DIR/favicon-48.png" "$TEMP_DIR/favicon-64.png" "favicon.ico"

echo "Favicon created successfully: favicon.ico"

# Copy to public directory
echo "Copying favicon to public directory..."
PUBLIC_DIR=${PUBLIC_DIR:-"./public"}
mkdir -p "$PUBLIC_DIR"
cp favicon.ico "$PUBLIC_DIR/"

echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "All done! Favicon has been created and placed in the public directory."
