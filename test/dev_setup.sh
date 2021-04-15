set -exo pipefail
npm install
USER=${1:-"khrome"}
AA_ROOT_PATH_DESTINATION=$(pwd)
cd ..
git clone git@github.com:${USER}/ascii-art-image.git
git clone git@github.com:${USER}/ascii-art-ansi.git
git clone git@github.com:${USER}/ascii-art-braille.git
git clone git@github.com:${USER}/ascii-art-docs.git
git clone git@github.com:${USER}/ascii-art-font.git
git clone git@github.com:${USER}/ascii-art-utf.git
git clone git@github.com:${USER}/ascii-art-graph.git
git clone git@github.com:${USER}/ascii-art-table.git
cd $AA_ROOT_PATH_DESTINATION
#link everything together using npm link
npx module-auto-link -c 'npm-auto-link'
