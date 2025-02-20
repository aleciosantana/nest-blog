FROM node:23-alpine
WORKDIR /usr/src/app
COPY package*.json pnpm*.yaml ./
RUN apk add --no-cache netcat-openbsd && npx pnpm install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN npx pnpm build
EXPOSE 3000
RUN chmod +x start.sh
CMD ["sh", "./start.sh"]