# Changelog

## 2.0.0 — 2026-09-22

### 첫 배포 구성

- npm 조직 `broccoil`의 `@broccoil/lint`의 첫 공개 버전을 제공합니다.
- 참고 2.0.1의 React/Next Flat Config, 기존 공개 경로와 규칙 정책을 유지합니다. 참고 번호와 새 패키지의 배포 번호는 별개입니다.
- package.json·lockfile·Node 설정·CI·tarball 설치 검증을 갖추고 `main`에서 2.x를 유지합니다. npm 태그는 `latest`입니다.
- React 단독 사용에는 Next plugin이 필요하지 않습니다. Next preset에는 `@next/eslint-plugin-next@16`을 별도로 설치합니다.

### 1.x와의 차이

- ESLint 10.0.1 이상 11 미만, TypeScript 6.0.2 이상 6.1 미만을 요구합니다. Node는 `^22.13.0 || >=24.0.0`입니다.
- React plugin이 @eslint-react 2.x에서 5.x로 바뀌면서 일부 rule ID가 변경됩니다. 예: `@eslint-react/no-useless-fragment` → `@eslint-react/jsx-no-useless-fragment`, `@eslint-react/dom/no-script-url` → `@eslint-react/dom-no-script-url`.
- 접근성 plugin과 규칙 namespace가 `jsx-a11y`에서 `jsx-a11y-x`로 바뀝니다. 기존 rule override와 inline disable을 확인해야 합니다.
- 부모 폴더 상대 import는 core `no-restricted-imports`로 경고합니다. 1.x plugin의 alias 자동 변환은 제공하지 않습니다.
- JS/JSX 미정의 식별자는 core `no-undef`로 검사합니다. TS/TSX에서는 이 규칙을 꺼서 React 타입 namespace 오탐을 방지하며 타입 검사는 별도로 실행합니다.
- 1.x의 명시적 JSX 중복 props, boolean/Fragment 축약, string ref 규칙 일부는 2.x 목록에 없습니다. 완전히 동일한 진단 결과를 보장하지 않습니다.
- Prettier 연결, import 정렬, 미사용 import 제거, 로컬 `hoseop-react` 규칙 ID와 exhaustive-deps off 정책은 유지합니다.

1.x는 `1.x` 브랜치에서 별도의 `legacy` 태그로 유지합니다. 그 계열의 첫 배포 내역은 [1.x CHANGELOG](https://github.com/HoSeopLee/lint/blob/1.x/CHANGELOG.md)를 참고하세요.
