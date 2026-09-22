# Changelog

## 1.0.0 — 배포 준비 중

### 첫 배포 구성

- npm 조직 `broccoil`의 `@broccoil/lint`로 배포를 준비합니다. 아직 npm에 게시하지 않았습니다.
- 참고 1.1.1의 React/Next Flat Config와 모든 공개 경로를 유지합니다. 참고 번호와 새 패키지의 배포 번호는 별개입니다.
- ESLint 9, TypeScript 4.8.4 이상 6 미만, Node 20.19.0 이상의 기존 환경을 대상으로 합니다.
- React 단독 사용에는 Next plugin이 필요하지 않습니다. Next preset에는 프로젝트에 맞춰 `@next/eslint-plugin-next@15` 또는 `@16`을 별도로 설치합니다.
- 기존 React 2.x plugin, `jsx-a11y/*` 접근성 규칙, 상대 import의 alias 변환/fix 정책, Prettier 연결, import 정렬과 미사용 import 제거를 유지합니다.
- 로컬 `hoseop-react/no-unsafe-target-blank` 규칙 ID와 exhaustive-deps off 정책을 유지합니다.
- 브랜치별 lockfile·Node 설정·CI와 실제 tarball 소비 검증을 추가합니다. `1.x` 브랜치에서 유지하며 npm 태그는 `legacy`입니다.

2.x는 ESLint 10 / TypeScript 6.0용 계열로 별도 유지합니다. 두 계열의 지원 환경과 규칙 이름·자동 수정 차이는 [README](README.md), 자세한 내용은 [호환성 분석](docs/compatibility.md)을 참고하세요. 설치할 major를 바꾸는 것만으로 기존 진단/fix 결과가 그대로 유지되지는 않습니다.
