#!/bin/bash
# Verification script for next agent

echo "=== UniVox PK Setup Verification ==="
echo ""

echo "1. Checking npm dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules exists"
else
    echo "   ❌ node_modules missing - run: npm install --legacy-peer-deps"
fi

echo ""
echo "2. Checking database connection..."
if docker ps | grep -q univox-pg; then
    echo "   ✅ PostgreSQL container running"
else
    echo "   ❌ PostgreSQL not running - run: docker compose up -d"
fi

echo ""
echo "3. Checking .env.local..."
if [ -f ".env.local" ] && grep -q "DATABASE_URL" .env.local; then
    echo "   ✅ .env.local configured"
else
    echo "   ❌ .env.local missing or incomplete"
fi

echo ""
echo "4. Checking Next.js build..."
if [ -d ".next" ]; then
    echo "   ✅ Build artifacts exist"
else
    echo "   ⚠️  Run: npm run build"
fi

echo ""
echo "5. Checking Claude Code permissions..."
if [ -f ".claude/settings.json" ]; then
    echo "   ✅ Claude settings configured"
else
    echo "   ❌ Claude settings missing"
fi

echo ""
echo "6. Testing HTTP connection..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/universities 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Dev server responding (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  Dev server check: HTTP $HTTP_CODE (may not be running)"
fi

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Add seed data: npx prisma db seed"
echo "  3. Fix Prisma schema: npx prisma db pull --force"
echo "  4. Login to Claude Code: /login"
