# API
Various APIs for chat, authentication, terminal interaction, image serving, and file upload.

## Requirements of API

1. Node.js
2. npm

After cloning API open a terminal and run "sudo apt-get install -y node npm" if running Debian based Linux to install node.js and npm package manager.

ExpressFormidableUploadAPI.js requires the express and formidable packages. Install by running "npm install express formidable".

You can run all APIs by executing "start_all_apis.sh". In a terminal run "./start_all_apis.sh" while in the API directory.

Here is a brief description of available APIs:

#!/bin/sh

# filename: ActiveUserAPI.js
# port: 8080
gnome-terminal -- node ActiveUserAPI.js
##

# filename: accountUI.js (requires api.js)
# port: 8081
gnome-terminal -- node accountUI.js
##

# filename: creditUI.js (requires systemChecks.js)
# port: 8082
gnome-terminal -- node creditUI.js
##

# filename: systemChecks.js
# port: 8083
gnome-terminal -- node systemChecks.js

# filename: scaledTextEntry.js (requires terminalAPI.js)
# port: 8084
gnome-terminal -- node scaledTextEntry.js
##

# filename: api.js (Account and Ledger API)
# port: 8087
gnome-terminal -- node api.js

# filename: terminalAPI.js
# port: 8089
gnome-terminal -- node terminalAPI.js
##

# filename: ImageRequestAPI.js
# port: 8090
gnome-terminal -- node ImageRequestAPI.js
##

# filename: auth.js (Authentication Server API)
# port: 8092
gnome-terminal -- node auth.js
##

# filename: chat.js (requires auth.js, AddUserAPI.js, ImageRequestAPI.js, ActiveUserAPI.js)
# port: 8093
# url: http://localhost:8093
# url local network is your local network IP address (Something like http://192.168.1.2:8093)
# domain url: point a domain name at your global IP and forward ports 8080 through 8099 to your computer
#   The external url form is http://yourdomain.tld:8093
gnome-terminal -- node chat.js
##

# filename: AddUserAPI.js
# port: 8095
gnome-terminal -- node AddUserAPI.js

# filename: ChatLogAPI.js
# port: 8096
gnome-terminal -- node ChatLogAPI.js
##

# filename: FileUploadAPI.js
# port: 8097
gnome-terminal -- node FileUploadAPI.js

# filename: ExpressFormidableUploadAPI.js
# port: 8098
gnome-terminal -- node ExpressFormidableUploadAPI.js
