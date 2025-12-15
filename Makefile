.PHONY: setup up stack_up down stack_down dev worker logs clean

setup:
	@echo "Installing dependencies..."
	bun install
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
	fi
	@echo "Setup complete!"

up stack_up:
	docker compose -f docker-compose.dev.yml up -d
	@echo "Waiting for services to be healthy..."
	@sleep 5
	@echo "Stack is up!"

down stack_down:
	docker compose -f docker-compose.dev.yml down

dev:
	bun run dev

worker:
	bun run worker:dev

logs:
	docker-compose -f docker-compose.dev.yml logs -f

clean:
	docker-compose -f docker-compose.dev.yml down -v
	rm -rf node_modules
	@echo "Cleaned!"
