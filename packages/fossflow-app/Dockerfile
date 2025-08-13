FROM node:22-alpine

USER node
WORKDIR /opt/openflow

COPY --chown=node:node package*.json ./
RUN npm ci && npm cache clean --force

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"]