FROM node:0.10.30

RUN apt-get update && apt-get install graphicsmagick -y

RUN npm i -g bower grunt-cli

RUN mkdir /app

RUN cd /app && npm install rapptor@0.13.0 grunt-set-rapptor@0.0.12

WORKDIR /app

CMD [ "node", "index.js" ]
