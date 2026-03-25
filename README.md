# banglakids
Educational games to teach Bangla to 5–7 year olds.

## Getting Started

### 1. Clone the repo
```sh
git clone https://github.com/vedas2/banglakids.git
cd banglakids
```

### 2. Run the setup script (once)
```sh
sh scripts/setup.sh
```
This configures the shared git hooks, including a pre-push guard that prevents direct commits to `main`.

### 3. Open in browser
No build step needed — open `index.html` directly in a browser.

## Contributing

This project uses feature branching. Direct pushes to `main` are blocked both locally (via git hook) and on GitHub (branch protection).

```sh
# Start a new feature
git checkout -b feature/your-feature-name

# Push and open a PR
git push -u origin feature/your-feature-name
# Then open a pull request on GitHub to merge into main
```
