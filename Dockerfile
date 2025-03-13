# Build Stage
FROM node:18-alpine AS build
WORKDIR /home/app
COPY ./frontend/ ./
RUN npm install
RUN npm run build

# Production Stage
FROM python:3.11.4

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory to /home/app
WORKDIR /home/app

# Copy only the requirements file to optimize caching
COPY ./backend/facet/ ./
COPY ./entrypoint.sh ./
COPY --from=build /home/app/out/ ./build/

# Install system dependencies and update the package list
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    chmod +x entrypoint.sh

EXPOSE 8000
 CMD ["/home/app/entrypoint.sh"]