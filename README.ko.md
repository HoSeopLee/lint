# @broccoil/lint

[English](https://github.com/HoSeopLee/lint/blob/1.x/README.md) | **한국어**

React와 Next.js 프로젝트를 위한 ESLint Flat Config입니다. TypeScript, React Hooks, 접근성, import 정렬, 미사용 import 제거, Prettier 규칙을 함께 제공합니다.

- React: JSX key, Hooks 호출 순서, Context 값, 외부 링크 검사
- TypeScript: naming convention, `any`·빈 함수 경고, `as const` 검사
- 접근성: 이미지 대체 텍스트, ARIA 속성, label, 키보드 이벤트 검사
- import: 그룹별 자동 정렬, 미사용 import 제거, 중복·자기 import 검사
- Prettier: ESLint를 통한 포맷 검사와 자동 수정
- Next.js: Link·Image·Script·Document 관련 규칙 추가

[npm](https://www.npmjs.com/package/@broccoil/lint) · [GitHub](https://github.com/HoSeopLee/lint)

ESLint Flat Config 전용이며 `.eslintrc` 설정은 지원하지 않습니다.

## 지원 환경

프로젝트의 ESLint와 TypeScript 버전에 맞춰 선택하세요.

| | 1.x | 2.x |
| --- | --- | --- |
| ESLint | 9.x | 10.0.1 이상, 11 미만 |
| TypeScript | 4.8.4 이상, 6 미만 | 6.0.2 이상, 6.1 미만 |
| Node.js | 20.19.0 이상 | 22.13.0 이상인 22.x 또는 24 이상 |
| Next.js plugin (선택) | 15.x / 16.x | 16.x |

설치되는 plugin의 Node.js 요구사항도 충족해야 합니다.

## 설치

```sh
# ESLint 9 / TypeScript 5
pnpm add -D @broccoil/lint@1 eslint@9 typescript@5

# ESLint 10 / TypeScript 6.0
pnpm add -D @broccoil/lint@2 eslint@10 typescript@~6.0.2
```

위 명령 중 프로젝트에 맞는 하나를 실행합니다. pnpm이 없다면 [pnpm 설치 안내](https://pnpm.io/installation)를 먼저 확인하세요.

pnpm의 기본 설정(`autoInstallPeers: true`)에서는 누락된 필수 plugin이 peer 의존성으로 함께 설치됩니다. 프로젝트에서 이 설정을 껐거나 기존 의존성과 버전이 충돌한다면 설치한 패키지의 `peerDependencies` 범위에 맞춰 명시적으로 설치해야 합니다.

Next.js 설정을 사용할 때는 `@next/eslint-plugin-next`도 설치하세요. 1.x는 15 또는 16, 2.x는 16을 지원합니다.

```sh
pnpm add -D @next/eslint-plugin-next@16
```

React 설정만 사용한다면 Next.js plugin은 필요하지 않습니다.

## 사용

프로젝트 루트에 `eslint.config.mjs`를 만듭니다.

```js
// React
import config from '@broccoil/lint/react';

export default config;
```

Next.js 프로젝트에서는 import 경로를 바꿉니다.

```js
// Next.js
import config from '@broccoil/lint/next';

export default config;
```

검사하거나 수정 가능한 문제를 자동으로 고칩니다.

```sh
pnpm exec eslint src
pnpm exec eslint src --fix
```

Prettier는 ESLint에 연결되어 있으며, import 정렬과 미사용 import 제거도 `--fix`로 처리합니다. TypeScript 타입 검사는 프로젝트의 tsconfig를 기준으로 별도 실행하세요.

```sh
pnpm exec tsc --noEmit
```

기본 설정에는 타입 정보가 필요한 lint 규칙이 없어 `parserOptions.project`를 지정할 필요가 없습니다. 타입 기반 규칙을 추가할 때는 프로젝트에 맞는 `projectService` 또는 `project` 설정이 필요합니다.

React/Next.js 규칙은 `.js`, `.jsx`, `.ts`, `.tsx` 파일을 대상으로 합니다. React는 브라우저 globals, Next.js는 브라우저와 Node.js globals를 제공합니다. `.mjs`, `.cjs`, `.mts`, `.cts`에는 동일한 규칙을 제공하지 않습니다.

## 규칙 변경

프로젝트에서 바꿀 규칙을 설정 배열의 마지막에 추가합니다.

`react-hooks/exhaustive-deps`는 기본적으로 꺼져 있습니다. 의존성 배열 검사도 사용하려면 아래처럼 켜세요.

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

상위 폴더 상대 경로(`../shared`)를 허용하려면 1.x에서는 `no-relative-import-paths/no-relative-import-paths`, 2.x에서는 `no-restricted-imports`를 `off`로 설정합니다. 1.x의 자동 변환은 `src`를 기준으로 `@/` 경로를 사용하므로 프로젝트의 alias 설정을 맞춰야 합니다.

## 1.x에서 2.x로 변경할 때

설정의 import 경로는 동일합니다. 지원 환경 외에 다음 차이를 확인하세요.

| 항목 | 1.x | 2.x |
| --- | --- | --- |
| 접근성 규칙 ID | `jsx-a11y/*` | `jsx-a11y-x/*` |
| React plugin | `@eslint-react` 2.x | `@eslint-react` 5.x, 일부 규칙 ID 변경 |
| 상위 폴더 상대 import | alias 자동 변환 지원 | 경고만 제공, alias 자동 변환 없음 |
| TS/TSX의 `no-undef` | 활성화 | 비활성화, TypeScript 타입 검사 필요 |
| 외부 링크 규칙 ID | 1.0.0은 `hoseop-react/no-unsafe-target-blank` | `broccoil-react/no-unsafe-target-blank` |

규칙을 덮어쓰거나 `eslint-disable` 주석을 사용한다면 변경된 규칙 ID를 확인하세요. 상세 변경은 [2.x 변경 내역](https://github.com/HoSeopLee/lint/blob/main/CHANGELOG.md)과 [1.x 변경 내역](https://github.com/HoSeopLee/lint/blob/1.x/CHANGELOG.md)에서 확인할 수 있습니다.

## smartm2m-eslint-config에서 이전

`smartm2m-eslint-config@1.1.1` 사용자는 `@broccoil/lint@1`, `2.0.1` 사용자는 `@broccoil/lint@2`를 선택하고 설정 파일의 import 패키지명을 바꾸세요. `/react`, `/next` 등 하위 경로는 같습니다.

사용자 설정이나 `eslint-disable` 주석에 `smartm2m-react/no-unsafe-target-blank`를 썼다면 설치한 버전의 외부 링크 규칙 ID로 변경해야 합니다. `@broccoil/lint@1.0.0`은 `hoseop-react/no-unsafe-target-blank`, 2.x는 `broccoil-react/no-unsafe-target-blank`를 사용합니다. 2.x는 Node.js 23을 지원하지 않으므로 위 지원 환경도 확인하세요.

## 추가 import 경로

기본 import인 `@broccoil/lint`는 React 설정을 제공합니다. 아래 경로도 사용할 수 있습니다.

| 경로 | 반환값 |
| --- | --- |
| `/presets/base` | JavaScript, import, Prettier 설정 배열 |
| `/presets/react` | `/react`와 같은 설정 배열 |
| `/presets/next`, `/presets/full` | `/next`와 같은 설정 배열 |
| `/ts`, `/a11y`, `/import`, `/prettier` | 개별 설정 객체 |

`/ts`에는 TypeScript parser와 plugin이 포함됩니다.

```js
import tsConfig from '@broccoil/lint/ts';

export default [tsConfig];
```

`/a11y`, `/import`, `/prettier`는 사용자 정의 설정을 조합할 때 사용합니다. 기본 React/Next.js 설정에는 이미 포함되어 있어 다시 추가할 필요가 없습니다.

[MIT License](LICENSE)
