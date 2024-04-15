FROM node as builder

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/docker/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
