# 개발 환경과 브랜치 운영

## 합의한 방식

같은 저장소와 npm 패키지 `@hoseop/lint`를 사용합니다. `1.x` 브랜치는 1.0.0부터 legacy를 유지하고, `main`은 2.0.0부터 modern을 유지합니다. 각 브랜치의 루트 package.json과 package-lock.json이 해당 계열의 배포 단위입니다.

초기 준비는 `codex/release-2.x`에서 검토할 수 있습니다. 이 브랜치를 main에 반영하면 modern의 유지 브랜치가 됩니다. legacy 소스는 `1.x`에 별도로 둡니다. 참고 폴더를 workspace에 연결하거나 런타임에서 import하지 않습니다.

## 다른 컴퓨터에서 시작

```sh
git clone https://github.com/HoSeopLee/lint.git
cd lint
git switch main
nvm use
npm ci --engine-strict
npm test
npm run test:package
```

1.x 작업은 `git switch 1.x` 후 다시 `npm ci --engine-strict`를 실행합니다. 개발 작업은 해당 유지 브랜치에서 `codex/<작업명>` 브랜치를 만들어 진행합니다. Node 24를 기본 개발 환경으로 사용하고 CI에서 해당 계열의 최소 Node도 확인합니다.

## 구조

```text
package.json
package-lock.json
index.js / react.js / next.js
presets/
rules/
__tests__/
.github/workflows/ci.yml
README.md
CHANGELOG.md
docs/
reference/                  # 비교용, 배포 제외
```

## 검증

- `npm test`: 기존 entry point 로드, parser와 lint 실행, 규칙 fixture, import 수정 검사
- `npm run test:package`: tarball 파일 목록, 격리된 React/Next 설치, 정상 코드 무진단, 오류 진단, 정확한 import 정렬과 재수정 안정성
- CI: lockfile의 의존성으로 설치·테스트하고, tarball 소비 프로젝트에서는 선언 범위에 맞는 의존성을 새로 해석해 확인

정책 변경은 기존 설정 이전과 분리합니다. 두 계열에 필요한 버그 수정은 각각 적용하고 검증합니다. major 간 브랜치를 통째로 병합해 의존성을 섞지 않습니다.

## 배포

**실제 npm 업로드는 분리 결과·검증 기록·배포 대상에 대한 사용자 승인을 받은 뒤에만 실행합니다.** CI는 테스트만 수행합니다. push나 태그 생성만으로 배포되지 않습니다.

승인 전 `npm whoami`, 패키지명/scope 권한, 미사용 버전 번호, 깨끗한 Git 상태, 아래 검사를 확인합니다.

```sh
npm ci --engine-strict
npm test
npm run test:package
npm pack --dry-run
```

승인된 계열의 브랜치에서 실행합니다.

```sh
# 1.x 브랜치, package.json version: 1.0.0
npm publish --access public --tag legacy

# main 브랜치, package.json version: 2.0.0
npm publish --access public --tag latest
```

package.json의 publishConfig에도 계열별 태그를 지정합니다. prepublishOnly는 테스트와 tarball 소비 검증을 실행합니다. 처음 배포한 뒤 npm 버전·태그를 확인하고 실제 배포된 커밋에 `v1.0.0`, `v2.0.0` Git 태그를 기록합니다. 후속 버전은 계열별로 증가시킵니다.

인증 정보는 저장소나 채팅에 넣지 않습니다. scope와 버전은 참고 자료의 이름·번호만 보고 사용 가능하다고 판단하지 않습니다.
