# Today Web Extension

## Getting Started
1. `pnpm i`
1. `pnpm dev`
1. Open `localhost:3303/options/index.html`

## Explanatory Videos
1. [Intro to the codebase](https://www.loom.com/share/2ff403bf3ed4457c8f358382ce64bf8e?sid=edcfa0d6-930b-4cf6-b394-9cbfe82f2d8e)
1. [How to run the app locally](https://www.loom.com/share/d72cfe4c298c4d34bc87aa1df5c30aec)

## Commit Convention
1. Prefix your commit with one of these:
```
feat: add new feature / component
fix: fix something
visual: related to visual (HTML / CSS) of the app
refactor: improving code without adding feature
docs: related to documentation
style: related to code style (linting)
perf: related to performance
test: related to tests
chore: related to dependencies, and other miscellaneous things
content: related to changing the text or content in the app
```
2. Optionally include the scope of the commit after the prefix (without space)  
Example: `feat(TaskList): add done tasks toggle`
3. When the commit is unsual / important, include a commit body message telling why the commit is done

## Publish to Chrome Web Store
1. Reinstall the extension locally, make sure everything is working well.
1. Increment "version" in `package.json`. Use semantic versioning [convention](https://semver.org/).
2. `pnpm build`. Then compress the generated `extension` folder into a .zip file.
3. Login to [CWS Developer Dashboard](https://chrome.google.com/webstore/devconsole) using tinyramenstudio@gmail.com.
4. Go to Items -> Today -> Package -> click "Upload new package" -> Select the `extension.zip` file.
5. Review the draft Store listing submission, also the promotional assets.
6. Click "Submit for review".
