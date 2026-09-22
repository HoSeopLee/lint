# 첫 배포 검토

검증 및 사용자 승인: 2026-09-22. [PR #1](https://github.com/HoSeopLee/lint/pull/1)은 병합했고, `1.0.0`을 배포했습니다. `2.0.0`은 README 검토 요청으로 npm 인증 전에 취소했으며 아직 게시하지 않았습니다.

## 브랜치 분리

| 항목 | Legacy | Modern |
| --- | --- | --- |
| 유지 브랜치 | 1.x | main |
| package.json 버전 | 1.0.0 | 2.0.0 |
| 참고 소스 | reference/v1.1.1 | reference/v2.0.1 |
| npm publishConfig.tag | legacy | latest |
| ESLint peer | >=9.0.0 <10.0.0 | >=10.0.1 <11.0.0 |
| TypeScript peer | >=4.8.4 <6.0.0 | >=6.0.2 <6.1.0 |
| Node engine | >=20.19.0 | ^22.13.0 또는 >=24.0.0 |
| Next plugin (선택 설치) | >=15.0.0 <17.0.0 | >=16.0.0 <17.0.0 |

각 브랜치 루트의 소스·package.json·lockfile·CI가 해당 계열만 실행합니다. reference의 다른 버전을 import하지 않습니다. 두 버전의 공개 import 경로는 동일합니다.

최종 패키지명은 **`@broccoil/lint`**입니다. 사용자가 생성한 npm 조직의 정확한 철자 `broccoil`을 확인하고 확정했습니다. `npm org ls broccoil --json`에서 로그인 계정 `leehoseop`의 owner 권한을 확인했습니다.

게시된 `1.0.0`의 gitHead는 `a9e411bcf426ae16d3b128696bdd8cd3d5323076`, shasum은 `bc47450eb34b551e3cee5396958f9178345428eb`입니다. `v1.0.0` Git 태그도 해당 커밋을 가리킵니다. npm에서 받은 `1.0.0`을 별도의 React/Next 소비 프로젝트에 설치해 진단과 자동 수정을 확인했습니다.

현재 npm의 `legacy`와 `latest`는 모두 `1.0.0`입니다. `2.0.0` 배포 후 `latest`를 확인해야 합니다. README 수정은 사용자 요청에 따라 두 브랜치에 반영하며, 이미 게시한 `1.0.0`은 재배포하지 않습니다.

후속 검토에서 커스텀 React plugin 이름도 `broccoil-react`로 확정했습니다. 두 브랜치의 실행 코드와 fixture를 맞추며, 1.x의 이 변경은 미배포 변경 내역에 기록합니다. 이미 게시된 `1.0.0`의 규칙 ID는 `hoseop-react/no-unsafe-target-blank`이므로 README에 설치 버전에 따른 차이를 안내합니다.

## 실행한 검증

| 검사 | 1.x | 2.x |
| --- | --- | --- |
| lockfile 설치 + 기존 npm test (최소 Node) | 20.19.0 통과 | 22.13.0 통과 |
| 기존 npm test (개발 Node) | 24.18.0 통과 | 24.18.0 통과 |
| 기존 규칙 fixture | 5/5 통과 | 8/8 통과 |
| tarball React/Next 설치·진단·수정 | Node 20.19.0, 24.18.0 통과 | Node 22.13.0, 24.18.0 통과 |
| GitHub CI (Linux) | Node 20.19.0 / 24 통과 | Node 22.13.0 / 24 통과 |
| 참고 코드와 규칙 로직 비교 | 동일 (주석·plugin namespace 변경) | 동일 (주석·plugin namespace 변경) |
| npm pack --dry-run (현재 브랜치) | 20개 파일 | 20개 파일 |
| README의 pnpm 설치·React/Next 검사 (pnpm 11.13.0 / Node 24.18.0) | 게시된 1.0.0 통과 | 2.0.0 tarball 통과 |

영문 `README.md`와 한국어 `README.ko.md`를 함께 제공합니다. 두 문서의 실행 예제가 같은지 확인했고, 한국어 문서도 배포 파일 목록에 추가했습니다. 이미 게시된 1.0.0은 기존 19개 파일을 유지합니다.

검증에 --force / --legacy-peer-deps를 사용하지 않았습니다. engine-strict 설치로 engine 제약도 확인했습니다. 이 결과는 모든 peer 버전 조합의 호환성을 보장하지 않습니다.

새 tarball 검사는 Next plugin이 없는 React 소비자와 Next plugin을 설치한 소비자를 각각 임시 디렉터리에 만들고 다음을 확인합니다.

- 모든 공개 entry point가 배포물에서 로드됨
- 정상 JSX/TSX는 진단 없음, 잘못된 비교에는 eqeqeq 진단
- import 정렬 결과가 기대 문자열과 일치하고 두 번째 fix는 변경 없음
- 미사용 import가 제거되고, Next 동기 script 오류가 검출됨
- 2.x의 React 타입 namespace에 core no-undef 오탐 없음
- reference·테스트·내부 문서·CI는 npm 파일 목록에서 제외

기존 테스트에는 Next pages 디렉터리가 없어 안내 경고가 출력됩니다. 새 소비자 검사에서는 실제 pages 디렉터리를 만들고 검증했습니다. 1.x 설치에는 기존 ESLint 9 및 일부 전이 의존성의 deprecated 안내가 나오며, 기존 환경 보존을 위해 이번 배포에서 major를 바꾸지 않았습니다.

릴리스 소스의 GitHub CI 결과: [1.x · a9e411b](https://github.com/HoSeopLee/lint/actions/runs/35700288193), [main · e594c67](https://github.com/HoSeopLee/lint/actions/runs/35700404114). 두 계열 모두 최소 Node와 Node 24 조합을 통과했습니다.

## 배포 확인

- [x] 최종 패키지명 `@broccoil/lint` 및 `broccoil` owner 권한 확인
- [x] `@broccoil/lint@1.0.0`·`@broccoil/lint@2.0.0` tarball의 React/Next 설치·진단·자동 수정 검증 (Node 24.18.0)
- [x] GitHub CI 결과 확인 (두 계열 합계 4개 Node 조합 통과)
- [x] 브랜치·버전·태그·검증 결과에 대한 사용자 승인 (2026-09-22)
- [x] 승인된 변경을 유지 브랜치에 반영 (PR #1 병합)
- [x] `1.0.0` npm 배포·실제 설치 검사·Git 태그 기록
- [ ] README 수정본 확인 후 `2.0.0` npm 배포
- [ ] `2.0.0` 실제 설치 검사·Git 태그 기록 및 최종 dist-tag 확인

자동 npm 배포 workflow는 없습니다. package.json의 prepublishOnly는 테스트만 수행하며 npm publish는 별도로 실행해야 합니다.
