FROM node:alpine

# Labels for GitHub to read the action
LABEL "com.github.actions.name"="Update Download Stats"
LABEL "com.github.actions.description"="Checks for and reports download stats for Electron."
LABEL "com.github.actions.icon"="package"
LABEL "com.github.actions.color"="gray-dark"

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl

ADD script/release.sh /script/release.sh
ENTRYPOINT ["/script/release.sh"]
