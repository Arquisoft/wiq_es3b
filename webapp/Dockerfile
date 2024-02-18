FROM node:20

COPY . /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
#COPY package*.json ./

#Install the dependencies
RUN npm install

# Copy the app source code to the working directory
#COPY . .

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]