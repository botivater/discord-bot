FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy the package list
COPY package.json yarn.lock ./

# Install the package list
RUN yarn

# Copy the source code
COPY . .

RUN yarn build

# Expose port 3000
EXPOSE 3000

# Run the startup script
CMD [ "./startup.sh" ]