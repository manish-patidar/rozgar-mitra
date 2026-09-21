# React + TypeScript + Vite

## Production Deployment

### Frontend on Vercel

1. Set `VITE_API_BASE_URL` to the Render backend URL ending in `/api`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Configure SPA fallback so all routes serve `index.html`.

See `.env.example` for the required frontend variable.

### Backend on Render with TiDB

Set these Render environment variables. Do not commit real values:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://<tidb-host>:4000/<database>?useSSL=true&requireSSL=true
SPRING_DATASOURCE_USERNAME=<tidb-user>
SPRING_DATASOURCE_PASSWORD=<tidb-password>
JWT_SECRET_KEY=<long-random-secret>
DB_MAX_POOL_SIZE=20
DB_MIN_IDLE=5
JPA_SHOW_SQL=false
HIBERNATE_SQL_LOG_LEVEL=WARN
HIBERNATE_BINDER_LOG_LEVEL=WARN
```

Use the backend Maven wrapper to build: `mvnw.cmd clean package -DskipTests`.
Run the generated jar with Java 25. Before production traffic, take a TiDB backup and verify that Hibernate has created the indexes from the `User` and `Task` entities. For a controlled schema, replace `spring.jpa.hibernate.ddl-auto=update` with a migration tool and set it to `validate`.

### Scale and load test checklist

- Run a load test against Render using realistic login, service list, booking, task list, and profile traffic.
- Start with multiple backend instances and keep JWT authentication stateless.
- Keep TiDB connection limits aligned with the total pool size across all Render instances.
- Add Redis for shared rate limiting/cache before enabling aggressive caching across instances.
- Monitor p95/p99 latency, error rate, DB CPU, active connections, slow queries, and Render memory before increasing traffic.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
