#!/bin/sh

# BanglaKids — One-time dev setup
# Run this once after cloning: sh scripts/setup.sh

echo "Setting up git hooks..."
git config core.hooksPath .githooks
chmod +x .githooks/pre-push
echo "✅ Done! Git hooks are active."
