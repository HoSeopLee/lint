# 첫 배포 검토

검증일: 2026-09-22. **실제 npm 업로드는 사용자 승인 전까지 보류합니다.**

## 브랜치 분리

| 항목 | Legacy | Modern |
| --- | --- | --- |
| 준비 브랜치 | 1.x | codex/release-2.x |
| 유지 브랜치 | 1.x | main (검토 후 반영) |
| package.json 버전 | 1.0.0 | 2.0.0 |
| 참고 소스 | reference/v1.1.1 | reference/v2.0.1 |
| npm publishConfig.tag | legacy | latest |
| ESLint peer | >=9.0.0 <10.0.0 | >=10.0.1 <11.0.0 |
| TypeScript peer | >=4.8.4 <6.0.0 | >=6.0.2 <6.1.0 |
| Node engine | >=20.19.0 | ^22.13.0 또는 >=24.0.0 |
| Next plugin (선택 설치) | >=15.0.0 <17.0.0 | >=16.0.0 <17.0.0 |

각 브랜치 루트의 소스·package.json·lockfile·CI가 해당 계열만 실행합니다. reference의 다른 버전을 import하지 않습니다. 두 버전의 공개 import 경로는 동일합니다.

패키지명은 현재 코드에 `@hoseop/lint`로 유지되어 있으나 **최종 scope 선택 대기 중**입니다. npm 로그인 계정은 `leehoseop`이고 `@hoseop` 조직 조회는 404였습니다. `@leehoseop/lint`로 바꿀지, `@hoseop` 권한을 별도로 준비할지 확인한 뒤 양쪽 이름을 확정합니다.

## 실행한 검증

| 검사 | 1.x | 2.x |
| --- | --- | --- |
| lockfile 설치 + 기존 npm test (최소 Node) | 20.19.0 통과 | 22.13.0 통과 |
| 기존 npm test (개발 Node) | 24.18.0 통과 | 24.18.0 통과 |
| 기존 규칙 fixture | 5/5 통과 | 8/8 통과 |
| tarball React/Next 설치·진단·수정 | Node 20.19.0, 24.18.0 통과 | Node 22.13.0, 24.18.0 통과 |
| GitHub CI (Linux) | Node 20.19.0 / 24 통과 | Node 22.13.0 / 24 통과 |
| 참고 코드와 runtime 파일 비교 | 동일 | 동일 |
| npm pack --dry-run | 19개 파일 | 19개 파일 |

검증에 --force / --legacy-peer-deps를 사용하지 않았습니다. engine-strict 설치로 engine 제약도 확인했습니다. 이 결과는 모든 peer 버전 조합의 호환성을 보장하지 않습니다.

새 tarball 검사는 Next plugin이 없는 React 소비자와 Next plugin을 설치한 소비자를 각각 임시 디렉터리에 만들고 다음을 확인합니다.

- 모든 공개 entry point가 배포물에서 로드됨
- 정상 JSX/TSX는 진단 없음, 잘못된 비교에는 eqeqeq 진단
- import 정렬 결과가 기대 문자열과 일치하고 두 번째 fix는 변경 없음
- 미사용 import가 제거되고, Next 동기 script 오류가 검출됨
- 2.x의 React 타입 namespace에 core no-undef 오탐 없음
- reference·테스트·내부 문서·CI는 npm 파일 목록에서 제외

기존 테스트에는 Next pages 디렉터리가 없어 안내 경고가 출력됩니다. 새 소비자 검사에서는 실제 pages 디렉터리를 만들고 검증했습니다. 1.x 설치에는 기존 ESLint 9 및 일부 전이 의존성의 deprecated 안내가 나오며, 기존 환경 보존을 위해 이번 배포에서 major를 바꾸지 않았습니다.

GitHub CI 결과: [1.x · 6f9d0ea](https://github.com/HoSeopLee/lint/actions/runs/35698834994), [2.x · 956f5dc](https://github.com/HoSeopLee/lint/actions/runs/35698878799). 두 계열 모두 각 2개 Node 조합을 통과했습니다. 이후 변경은 이 검증 기록에 CI 결과를 추가한 문서 변경입니다.

## 배포 전 남은 확인

- [ ] 최종 패키지명/scope 권한 확정 및 해당 이름으로 검증
- [x] GitHub CI 결과 확인 (두 계열 합계 4개 Node 조합 통과)
- [ ] 브랜치·버전·태그·검증 결과에 대한 사용자 승인
- [ ] 승인된 변경을 유지 브랜치에 반영하고 두 버전 npm 배포
- [ ] 배포된 버전·dist-tag·설치 확인 및 Git 릴리스 태그 기록

자동 npm 배포 workflow는 없습니다. package.json의 prepublishOnly는 테스트만 수행하며 npm publish는 별도로 실행해야 합니다.
