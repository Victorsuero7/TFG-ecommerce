# TFG-ecommerce

## Instructions 
* clone project 
* move to backend or fronted directory (cd /backend)
* execute npm install (on both directories)
* Create your own .env files based on .env.example files


## Define standard naming conventions

* Use camelCase for variable and function names.
* Use UPPER_CASE for global constants to clearly indicate immutable compile-time values.
* Use PascalCase for class names and interface names.
* Use camelCase for interface members.
* Use PascalCase for type names and enum names.
* Name files with kebab-case (for example, ebs-volumes.tsx or storage.ts)
The following shows examples of these recommended naming conventions:

```ts
// Variables and functions
let userName = 'john';
function getUserData() { }

// Global constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Classes and interfaces
class DatabaseConnection { }
interface UserProfile { }

// Types and enums
type ResponseStatus = 'success' | 'error';
enum HttpStatusCode { }
```


### VS Code extensions used

- https://marketplace.visualstudio.com/items?itemName=RapidAPI.vscode-rapidapi-client
- https://marketplace.visualstudio.com/items?itemName=jakob101.RelativePath
- https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme
- https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets
- https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow
