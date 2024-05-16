FROM node:20.12.0 AS base

# create a folder called app
WORKDIR /app

# . means current WORKDIR (app)
COPY package.json .

#______________________________________________________________________________________________
FROM base AS development

RUN npm install

# COPY all files to WORKDIR
COPY . .

# PORT number of app inside the container (just for documentation)
EXPOSE 4000

# Run app
CMD [ "npm", "run", "start-dev" ]
#______________________________________________________________________________________________

FROM base AS production

RUN npm install --only=production
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "start-prod" ]
