
build: components index.js
				@component build --dev

dist: components
				@component build --standalone oz-val --name oz-val --out dist
				@uglifyjs dist/oz-val.js -o dist/oz-val.min.js

components: component.json
				@component install --dev

clean:
				rm -fr build components template.js dist

test: build
				component-test phantom

.PHONY: clean oz-val test
