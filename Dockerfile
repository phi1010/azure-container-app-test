FROM node:22-alpine AS frontend
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./package*.json ./
USER node
RUN npm ci
COPY --chown=node:node ./ ./
WORKDIR /home/node/app
RUN NODE_OPTIONS=--max_old_space_size=8192 npm run build

FROM ghcr.io/astral-sh/uv:debian
COPY uv.lock pyproject.toml /usr/src/app/
WORKDIR /usr/src/app
RUN uv sync
COPY ./backend /usr/src/app/
COPY --from=frontend /home/node/app/dist  /usr/src/app/dist/
EXPOSE 80

CMD ["uv","run","gunicorn","-c","gunicorn.conf.py","main:app"]