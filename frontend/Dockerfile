FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json* ./
# Avoid installing optional native packages (e.g. rollup native musl builds)
ENV npm_config_optional=false
RUN npm ci --no-optional --silent || npm install --no-optional --silent

# Some Rollup/Vite versions attempt to load an optional native binary package
# (e.g. @rollup/rollup-linux-x64-gnu). In some npm/npm-ci situations the optional
# package may not be present which causes a runtime error. Install the GNU
# native package explicitly to satisfy the loader (no failure if unavailable).
RUN npm install --no-audit --no-fund @rollup/rollup-linux-x64-gnu --silent || true

# Copy entrypoint early and ensure proper permissions (and LF line endings)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
	chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy the rest of the app source
COPY . .

EXPOSE 5173
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
