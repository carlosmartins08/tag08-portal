FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM build AS migration

CMD ["npm", "run", "db:migrate"]

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]

FROM runtime AS jobs

COPY --from=build /app/server ./server

CMD ["node", "server/integrationWorker.mjs"]
