NAME = tz

HOST := 0.0.0.0
PORT := 8000
IP := $(HOST)

# Use $(shell pwd) || $(CURDIR) instead of $(PWD)?
APP_HOME = $(shell pwd)
BOWER_COMPONENTS = bower_components
NODE_MODULES = node_modules

# NPM config
ifdef USE_DOCKER
	NPM_BUILDER = node:4
	NPM_ARGS =  --no-bin-links --unsafe-perm
	BOWER_ARGS =  --allow-root
	DOCKER_NPM = docker run -it \
		--name node-$(NAME) \
		-v "$(APP_HOME)":/usr/src/app \
		-v "$(HOME)/.npm":/root/.npm \
		-v "$(HOME)/.ssh/id_rsa":/root/.ssh/id_rsa \
		-v "$(BOWER_COMPONENTS)":/usr/src/app/bower_components \
		-v "$(NODE_MODULES)":/usr/src/app/node_modules \
		-v "$(SSH_AUTH_SOCK)":/ssh-agent \
		-e "SSH_AUTH_SOCK=/ssh-agent" \
		-e "DEV=$(DEV)" \
		-e "TEST=$(TEST)" \
		-e "PROD=$(PROD)" \
		-p $(PORT):8000 \
		-w /usr/src/app \
		-d $(NPM_BUILDER)

	DOCKER_NPM_START = docker start \
			node-$(NAME)

	DOCKER_NPM_RUN = $(DOCKER_NPM_START) && \
		docker exec -it \
			node-$(NAME)

endif


# Help
# https://gist.github.com/prwhite/8168133
help: ## Show this help.
	@echo "\
	Usage: make [options] [target] ...\n\
	Targets:"; \
	fgrep -h '##' Makefile | awk -F'##|:' '{printf "%40s %s\n", $$1, $$3}' | fgrep -v 'fgrep'

# NODE
npm_docker:
	@$(DOCKER_NPM)

node\:%:
	@$(DOCKER_NPM_RUN) \
		$(subst node:,,$@)

npm_configure: npm_docker
	@$(DOCKER_NPM_RUN) \
		sh -c 'echo "Host github.com\n\tStrictHostKeyChecking no\nIdentityFile ~/.ssh/id_rsa\n" >> /etc/ssh/ssh_config \
		&& chmod 700 /root/.ssh/id_rsa \
		&& PATH=$PATH";/usr/src/app/node_modules/.bin/"'

npm_dep:
	@$(DOCKER_NPM_RUN) \
		npm install $(NPM_ARGS)

configure: npm_docker ## Run this first if use Docker
build_dep: npm_dep ## Build all dependences

compile: ## Run tasks to compile sources
	@$(DOCKER_NPM_RUN) \
	    node node_modules/webpack/bin/webpack

build: build_dep compile ## Build project

server: build ## Lounch test server with `make server --env "PORT=$PORT"`
	@$(DOCKER_NPM_RUN) \
	    node node_modules/webpack-dev-server/bin/webpack-dev-server \
	    	--host $(IP) \
	    	--port $(PORT) \
	    	--hot --inline

start:
	@$(DOCKER_NPM_START)

clean:
	@rm -rf $(NODE_MODULES) $(BOWER_COMPONENTS) bundle.js
