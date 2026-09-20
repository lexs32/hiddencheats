@echo off
cd /d "%~dp0"
if not exist ".git" (
    git init
    git branch -M master
    git remote add origin https://github.com/lexs32/hiddencheats.git
)
git add .
git commit -m "Deploy HiddenCheats storefront to production"
git push -u origin master
npx vercel --prod
