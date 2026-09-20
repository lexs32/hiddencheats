@echo off
cd /d "%~dp0"
if not exist ".git" (
    git init
    git branch -M master
)
git add .
git commit -m "Initial commit: HiddenCheats storefront"
where gh >nul 2>nul
if %errorlevel% equ 0 (
    gh repo create hiddencheats --public --source=. --remote=origin --push
) else (
    git remote add origin https://github.com/lexs32/hiddencheats.git 2>nul
    git push -u origin master
)
npx vercel --prod
