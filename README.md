# lint

Shared lint presets for JavaScript and TypeScript projects, supporting legacy and modern environments with ESLint and Oxlint.

여러 프로젝트에서 공통으로 사용할 개인용 lint preset 라이브러리입니다. 패키지명은 `@hoseop/lint`를 검토하고 있습니다.

> 현재는 분석과 설계 준비 단계입니다. 새 preset 구현, 의존성 설치, npm 배포는 아직 진행하지 않았습니다. 아래 지원 범위와 API는 목표이며 사용 가능한 기능을 의미하지 않습니다.

## 방향

- 기존 1.1.1 설정을 기존 프로젝트 호환성 기준으로 유지합니다.
- 2.x는 ESLint 10 / TypeScript 6 환경의 기준으로 활용합니다.
- 공통 lint 정책을 유지하면서 환경에 맞게 plugin과 규칙 구현을 선택합니다.
- legacy는 ESLint 중심, modern은 Oxlint와 ESLint의 역할 분담을 검토합니다.
- 단일 패키지를 우선 검증하고, 의존성 충돌이나 설치 부담이 해결되지 않을 때 분리합니다.

## 첫 배포 범위

먼저 2.0.1 설정을 기반으로 modern React/Next preset을 구현하고, 설치·실행 검증을 마치면 `0.1.0`으로 배포하는 것을 제안합니다. 기존 설정을 활용하되 대규모 규칙 변경은 별도 업데이트로 나눕니다.

legacy는 1.1.1 자료를 보존하며 후속 버전에서 지원합니다. Oxlint, Vue/Nuxt, ESLint 8, 추가 type-aware lint는 첫 배포 조건에 포함하지 않습니다. 전체 지원을 완성할 때까지 첫 배포를 미루지 않습니다.

현재는 root package.json과 배포용 entry point가 없어 npm 설치용 패키지가 아닙니다. 실제 구현 후 [배포 기준](docs/roadmap.md)을 통과한 범위만 README에 지원 기능으로 표시합니다.

## 장기 지원 목표와 현재 근거

| 대상 | 목표 | 현재 확인한 기준 |
| --- | --- | --- |
| Legacy | ESLint 8/9, TypeScript 5.x, 기존 React/Next 프로젝트 | 1.x 태그는 ESLint 9 기반. ESLint 8은 추가 호환성 검증 필요 |
| Modern | ESLint 10, TypeScript 6, React/Next | 2.0.1의 선언 범위와 설정을 참고. 새 패키지에서 재검증 필요 |
| Vue / Nuxt | modern preset 확장 | 기존 구현 없음. 후속 단계 |
| Oxlint | modern의 지원 규칙 처리 | 기존 구현 없음. 규칙별 동작·옵션·자동 수정 비교 필요 |

참고 기준은 1.1.1과 2.0.1 두 버전입니다. 이 숫자는 참고 자료의 버전이며, 새 `@hoseop/lint`의 배포 버전이 아닙니다.

## 사용 형태 제안

아래 경로는 설계 예시이며 현재 import할 수 없습니다. 기본 진입점의 의미와 preset 조합 방식은 설치 검증 후 확정합니다.

```js
// 기존 React 프로젝트
import config from '@hoseop/lint/legacy/react';

// 최신 React 프로젝트에서는 위 import 대신 사용
import config from '@hoseop/lint/modern/react';
```

Next.js는 `legacy/next`, `modern/next`, Vue/Nuxt는 `modern/vue`, `modern/nuxt`를 검토합니다. ESLint preset을 import하는 것만으로 Oxlint가 실행되지는 않습니다. Oxlint 설정과 실행 명령은 별도로 제공할 계획입니다.

## 문서

- [버전 비교와 호환성 분석](docs/compatibility.md): 선언된 지원 범위, 규칙 분류, 의존성 충돌과 이전 전략
- [구조 제안과 작업 계획](docs/roadmap.md): 구현 순서, 검증 기준, 결정해야 할 항목
- [버전별 참고 자료](reference/README.md): 기존 설정·테스트와 변경 범위

## 현재 저장소

```text
README.md
docs/
  compatibility.md
  roadmap.md
reference/
  README.md
  v1.1.1/
  v2.0.1/
LICENSE
```

`reference`는 비교용 보관 자료입니다. 새 패키지의 런타임 코드나 workspace가 아니며, 향후 npm 배포 파일에서 제외합니다. 기존 프로젝트의 설정 교체는 호환성 검증 후 진행합니다.

## 라이선스

[MIT](LICENSE). 이전한 소스에는 원본 라이선스를 유지합니다.
