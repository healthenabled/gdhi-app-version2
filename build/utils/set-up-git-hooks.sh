#!/usr/bin/env bash

echo "Setting Up Git commit Hooks......"

if [ ! -x .git/hooks/commit-msg ]
    then
    mkdir -p .git/hooks/
    echo "General format:
        1) Should start with GDHI-\`storyNumber OR Tech OR Anything else\`
        2) Then your commit message
        3) Should end with \`<YourName>\`

        Example: \`GDHI-000 Blah Blah Blah....... <Name1/Name2>\`"
fi

cp ./build/utils/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
