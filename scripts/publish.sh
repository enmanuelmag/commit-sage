#!/usr/bin/env bash
set -e

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Commit Sage Publisher${NC}"
echo "================================"

# Step 1: Check git worktree is clean
echo -e "${YELLOW}1️⃣  Checking git worktree...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Error: Worktree not clean. Commit or stash changes first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Worktree clean${NC}"

# Step 2: Run health check
echo -e "${YELLOW}2️⃣  Running health check...${NC}"
bash health.sh || exit 1
echo -e "${GREEN}✅ Health check passed${NC}"

# Step 3: Compile TypeScript
echo -e "${YELLOW}3️⃣  Compiling TypeScript...${NC}"
pnpm run compile
echo -e "${GREEN}✅ Compilation successful${NC}"

# Step 4: Extract version
VERSION=$(jq -r '.version' package.json)
echo -e "${YELLOW}4️⃣  Extracted version: ${VERSION}${NC}"

# Step 5: Publish to VS Code Marketplace
echo -e "${YELLOW}5️⃣  Packaging for VS Code Marketplace...${NC}"
npx vsce package --no-dependencies --no-update-package-json
echo -e "${GREEN}✅ Package created successfully${NC}"

# Step 6: Create git tag
echo -e "${YELLOW}6️⃣  Creating git tag v${VERSION}...${NC}"
git tag "v${VERSION}"
echo -e "${GREEN}✅ Git tag created${NC}"

# Step 7: Push to remote with tags
echo -e "${YELLOW}7️⃣  Pushing to remote with tags...${NC}"
git push --follow-tags
echo -e "${GREEN}✅ Pushed to remote${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 Release v${VERSION} completed!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Check VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=cardor.commit-sage"
echo "2. Monitor extension page for visibility"
echo "3. Check GitHub releases: https://github.com/enmanuelmag/commit-sage/releases"
