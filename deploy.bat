@echo off
cd /d "%~dp0"
if not exist ".git" (
    git init
    git branch -M master
    git remote add origin https://github.com/lexs32/hiddencheats.git
)
git add .
git commit -m "Restore ChamsCheats GSAP entrance and scroll animations across all pages"
git push -u origin master
npx vercel --prod
