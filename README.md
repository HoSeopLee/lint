# @broccoil/lint

**English** | [한국어](https://github.com/HoSeopLee/lint/blob/main/README.ko.md)

Shared ESLint Flat Config for React and Next.js projects, with TypeScript, React Hooks, accessibility, import sorting, unused import removal, and Prettier.

- React: JSX keys, Hooks call order, Context values, and external links
- TypeScript: naming conventions, warnings for `any` and empty functions, and `as const` checks
- Accessibility: image alt text, ARIA attributes, labels, and keyboard events
- Imports: automatic grouping and sorting, unused import removal, duplicate and self-import checks
- Prettier: formatting checks and automatic fixes through ESLint
- Next.js: additional Link, Image, Script, and Document rules

[npm](https://www.npmjs.com/package/@broccoil/lint) · [GitHub](https://github.com/HoSeopLee/lint)

ESLint Flat Config only. Legacy `.eslintrc` configurations are not supported.

## Compatibility

Choose the major version that matches your project's ESLint and TypeScript versions.

| | 1.x | 2.x |
| --- | --- | --- |
| ESLint | 9.x | >=10.0.1 <11 |
| TypeScript | >=4.8.4 <6 | >=6.0.2 <6.1 |
| Node.js | >=20.19.0 | ^22.13.0 or >=24.0.0 |
| Next.js plugin (optional) | 15.x / 16.x | 16.x |

Your Node.js version must also satisfy the installed plugins' requirements.

## Installation

```sh
# ESLint 9 / TypeScript 5
pnpm add -D @broccoil/lint@1 eslint@9 typescript@5

# ESLint 10 / TypeScript 6.0
pnpm add -D @broccoil/lint@2 eslint@10 typescript@~6.0.2
```

Run one of these commands for your project. If you do not have pnpm, follow the [pnpm installation guide](https://pnpm.io/installation) first.

With pnpm's default `autoInstallPeers: true`, missing required plugins are installed as peer dependencies. If your project disables this setting or has conflicting dependency versions, install the required peers explicitly within the package's `peerDependencies` ranges.

For the Next.js preset, also install `@next/eslint-plugin-next`. Version 1 supports plugin 15 or 16; version 2 supports plugin 16.

```sh
pnpm add -D @next/eslint-plugin-next@16
```

The Next.js plugin is not required when using only the React preset.

## Usage

Create `eslint.config.mjs` in your project root.

```js
// React
import config from '@broccoil/lint/react';

export default config;
```

For a Next.js project, change the import path.

```js
// Next.js
import config from '@broccoil/lint/next';

export default config;
```

Check your source files or automatically fix supported problems.

```sh
pnpm exec eslint src
pnpm exec eslint src --fix
```

Prettier runs through ESLint. Import sorting and unused import removal also work with `--fix`. Run TypeScript's type checker separately with your project's tsconfig.

```sh
pnpm exec tsc --noEmit
```

The standard presets do not enable type-aware lint rules, so `parserOptions.project` is not required. If you add rules that need type information, configure `projectService` or `project` for your project.

React and Next.js rules target `.js`, `.jsx`, `.ts`, and `.tsx` files. The React preset provides browser globals; the Next.js preset provides browser and Node.js globals. The same rules are not provided for `.mjs`, `.cjs`, `.mts`, or `.cts` files.

## Customizing rules

Add project-specific overrides after the preset.

`react-hooks/exhaustive-deps` is off by default. To enable dependency array checks, configure it as shown below.

```js
import config from '@broccoil/lint/react';

export default [
  ...config,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

To allow parent-relative imports such as `../shared`, turn off `no-relative-import-paths/no-relative-import-paths` in 1.x or `no-restricted-imports` in 2.x. Version 1's automatic conversion uses the `@/` alias rooted at `src`, so configure that alias in your project.

## Upgrading from 1.x to 2.x

Import paths stay the same. In addition to the compatibility requirements above, check these differences.

| Feature | 1.x | 2.x |
| --- | --- | --- |
| Accessibility rule IDs | `jsx-a11y/*` | `jsx-a11y-x/*` |
| React plugin | `@eslint-react` 2.x | `@eslint-react` 5.x, with some renamed rules |
| Parent-relative imports | Automatic alias conversion | Warning only, without automatic alias conversion |
| `no-undef` in TS/TSX | Enabled | Disabled; run TypeScript's type checker |
| External link rule ID | `hoseop-react/no-unsafe-target-blank` in 1.0.0 | `broccoil-react/no-unsafe-target-blank` |

Update rule overrides and `eslint-disable` comments for renamed rules. See the [2.x changelog](https://github.com/HoSeopLee/lint/blob/main/CHANGELOG.md) and [1.x changelog](https://github.com/HoSeopLee/lint/blob/1.x/CHANGELOG.md) for details.

## Migrating from smartm2m-eslint-config

Use `@broccoil/lint@1` when migrating from `smartm2m-eslint-config@1.1.1`, or `@broccoil/lint@2` when migrating from `2.0.1`. Replace the package name in your config imports. Subpaths such as `/react` and `/next` stay the same.

If your overrides or `eslint-disable` comments use `smartm2m-react/no-unsafe-target-blank`, replace it with the rule ID for your installed version: `hoseop-react/no-unsafe-target-blank` in `@broccoil/lint@1.0.0`, or `broccoil-react/no-unsafe-target-blank` in 2.x. Version 2 does not support Node.js 23; check the compatibility table above.

## Additional imports

The default `@broccoil/lint` import returns the React preset. These subpaths are also available.

| Subpath | Export |
| --- | --- |
| `/presets/base` | JavaScript, import, and Prettier config array |
| `/presets/react` | The same config array as `/react` |
| `/presets/next`, `/presets/full` | The same config array as `/next` |
| `/ts`, `/a11y`, `/import`, `/prettier` | Individual config objects |

The `/ts` export includes the TypeScript parser and plugin.

```js
import tsConfig from '@broccoil/lint/ts';

export default [tsConfig];
```

Use `/a11y`, `/import`, and `/prettier` when composing custom configurations. They are already included in the React and Next.js presets and do not need to be added again.

[MIT License](LICENSE)
