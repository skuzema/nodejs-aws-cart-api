FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/dist /app/dist
RUN npm install --only=production

ENV DB_HOST=aws-cart.c74wksemioie.eu-north-1.rds.amazonaws.com
ENV DB_PORT=5432
ENV DB_USERNAME=postgres
ENV DB_PASSWORD=mwBkW8aTxgFCzwiIY3j1
ENV DB_DATABASE=postgres

EXPOSE 3000

CMD ["node", "dist/main"]
