FROM node:20-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_GA4_ID
ARG NEXT_PUBLIC_GSC_VERIFICATION
ENV NEXT_PUBLIC_GA4_ID=$NEXT_PUBLIC_GA4_ID
ENV NEXT_PUBLIC_GSC_VERIFICATION=$NEXT_PUBLIC_GSC_VERIFICATION

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM build AS migration

CMD ["npm", "run", "db:migrate"]

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]

FROM runtime AS jobs

COPY --from=build /app/server ./server

CMD ["node", "server/integrationWorker.mjs"]
