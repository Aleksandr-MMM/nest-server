FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile

FROM node:18-alpine AS runner
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/configSettings ./configSettings
COPY --from=builder /app/certificate ./certificate
ENTRYPOINT [ "/sbin/tini", "--" ]
EXPOSE 3000/tcp
CMD [ "node", "dist/main.js" ]
