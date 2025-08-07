# Artifex.AI - 기술 상세 보고서

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [시스템 아키텍처](#시스템-아키텍처)
4. [주요 구성 요소](#주요-구성-요소)
5. [핵심 기능](#핵심-기능)
6. [노드 시스템](#노드-시스템)
7. [AI 통합](#ai-통합)
8. [사용자 인터페이스](#사용자-인터페이스)
9. [데이터 흐름](#데이터-흐름)
10. [보안 및 성능](#보안-및-성능)

---

## 프로젝트 개요

### 제품명
**Artifex.AI Professional Suite**

### 버전
v2.0.0

### 설명
Artifex.AI는 최첨단 AI 기술을 활용한 전문가급 비디오 제작 스위트입니다. 노드 기반 워크플로우와 타임라인 편집을 통합하여 창의적인 비디오 제작을 지원합니다.

### 주요 특징
- **듀얼 워크플로우 시스템**: 노드 기반 편집과 타임라인 편집 모두 지원
- **AI 생성 기능**: Wan 2.2 모델을 활용한 Text-to-Video, Image-to-Video
- **실시간 프리뷰**: GPU 가속을 통한 실시간 렌더링
- **전문가 도구**: Nuke/Houdini 스타일의 노드 에디터
- **크로스 플랫폼**: Windows, macOS, Linux 지원

---

## 기술 스택

### 프론트엔드
- **React 18.2.0**: 사용자 인터페이스 구축
- **TypeScript 5.4.5**: 타입 안정성 보장
- **Material-UI 5.15.15**: UI 컴포넌트 라이브러리
- **Redux Toolkit 2.2.3**: 상태 관리
- **ReactFlow 11.11.3**: 노드 기반 에디터 구현
- **Framer Motion 11.18.2**: 애니메이션 효과

### 백엔드
- **Electron 30.0.1**: 데스크톱 애플리케이션 프레임워크
- **Python Flask**: AI 모델 서버
- **Socket.io 4.7.5**: 실시간 통신
- **Express.js**: API 서버 (내장)

### 빌드 도구
- **Webpack 5.91.0**: 모듈 번들링
- **Babel 7.24.4**: JavaScript 트랜스파일링
- **Electron Builder 24.13.3**: 애플리케이션 패키징

### AI/ML
- **Wan 2.2 T2V/I2V**: 비디오 생성 모델
- **CUDA/GPU 지원**: 하드웨어 가속
- **TensorFlow/PyTorch**: ML 프레임워크 (서버 측)

---

## 시스템 아키텍처

### 전체 구조
```
┌─────────────────────────────────────────┐
│           Electron Main Process          │
│  - Window Management                     │
│  - Menu System                          │
│  - IPC Handler                          │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌───────▼──────┐
│   Renderer   │  │  Python AI   │
│   Process    │  │    Server    │
│              │  │              │
│  - React UI  │  │  - Flask     │
│  - Node Edit │  │  - Wan 2.2   │
│  - Timeline  │  │  - Socket.io │
└──────────────┘  └──────────────┘
```

### 프로세스 간 통신 (IPC)
- **Main ↔ Renderer**: Electron IPC를 통한 안전한 통신
- **Renderer ↔ AI Server**: Socket.io를 통한 실시간 통신
- **Preload Script**: Context Bridge를 통한 API 노출

---

## 주요 구성 요소

### 1. Main Process (src/main/main.ts)
- **역할**: 애플리케이션 생명주기 관리
- **주요 기능**:
  - BrowserWindow 생성 및 관리
  - 네이티브 메뉴 시스템
  - 파일 시스템 접근
  - GPU 가속 설정
  - 스플래시 스크린 표시

### 2. Renderer Process
#### App.tsx (src/renderer/App.tsx)
- **역할**: 메인 애플리케이션 컨테이너
- **구성**:
  - Material-UI 테마 설정 (다크 모드)
  - Redux Provider 설정
  - 라우팅 시스템
  - 초기화 로직

#### WorkspaceView.tsx (src/renderer/views/WorkspaceView.tsx)
- **역할**: 메인 작업 공간
- **모드**:
  - Timeline Mode: 전통적인 비디오 편집
  - Node Mode: 노드 기반 컴포지팅
  - Hybrid Mode: 두 모드 통합

### 3. Node Editor System (src/renderer/components/NodeEditor/)
- **핵심 컴포넌트**: NodeEditor.tsx
- **노드 타입**:
  - Input Node: 미디어 입력
  - Output Node: 최종 출력
  - AI Generator Node: AI 비디오 생성
  - Composite Node: 레이어 합성
  - Color Correction Node: 색상 보정
  - Audio Node: 오디오 처리

### 4. AI Server (server/app.py, src/backend/app.py)
- **역할**: AI 모델 실행 및 관리
- **기능**:
  - Wan 2.2 모델 로딩
  - 비디오 생성 처리
  - GPU 메모리 관리
  - 실시간 진행 상태 전송

---

## 핵심 기능

### 1. AI 비디오 생성
#### Text-to-Video (T2V)
- **모델**: Wan 2.2 T2V
- **해상도**: 최대 1280x720
- **FPS**: 24fps
- **길이**: 최대 5초
- **프롬프트 처리**: 자연어 입력

#### Image-to-Video (I2V)
- **입력**: 정적 이미지
- **모션 생성**: AI 기반 움직임 예측
- **스타일 보존**: 원본 이미지 스타일 유지

### 2. 노드 기반 워크플로우
- **시각적 프로그래밍**: 드래그 앤 드롭 인터페이스
- **실시간 연결**: 노드 간 데이터 흐름 시각화
- **커스텀 노드**: 확장 가능한 노드 시스템
- **그래프 실행**: 의존성 기반 처리

### 3. 타임라인 편집
- **멀티 트랙**: 비디오, 오디오, 효과 트랙
- **키프레임**: 애니메이션 파라미터 제어
- **트랜지션**: 장면 전환 효과
- **실시간 미리보기**: GPU 가속 재생

### 4. 미디어 처리
- **지원 포맷**:
  - 비디오: MP4, AVI, MOV, MKV
  - 이미지: JPG, PNG, GIF, WebP
  - 오디오: MP3, WAV, FLAC, AAC
- **코덱**: H.264, H.265, ProRes
- **해상도**: SD부터 4K까지

### 5. 실시간 협업
- **Socket.io 통신**: 실시간 업데이트
- **프로젝트 동기화**: 클라우드 저장
- **버전 관리**: 프로젝트 히스토리

---

## 노드 시스템

### 노드 유형 및 기능

#### 1. UniversalAINode
- **용도**: 범용 AI 처리
- **입력**: 텍스트, 이미지, 비디오
- **출력**: 생성된 콘텐츠
- **파라미터**: 모델 선택, 강도, 스타일

#### 2. CompositeNode
- **용도**: 레이어 합성
- **블렌드 모드**: Over, Add, Multiply, Screen
- **투명도 제어**: 0-100%
- **마스크 지원**: 알파 채널

#### 3. ColorSuiteNode
- **용도**: 전문 색상 보정
- **기능**:
  - 3-Way Color Corrector
  - Curves
  - HSL 조정
  - LUT 적용

#### 4. Model3DNode
- **용도**: 3D 모델 렌더링
- **지원 포맷**: OBJ, FBX, GLTF
- **렌더링**: WebGL 기반

#### 5. ProjectionMappingNode
- **용도**: 프로젝션 매핑
- **기능**: 왜곡 보정, 멀티 프로젝터 지원

### 노드 연결 시스템
- **데이터 타입**: Video, Audio, Image, Data, Control
- **타입 검증**: 호환 가능한 연결만 허용
- **실시간 검증**: 연결 시 즉시 유효성 검사

---

## AI 통합

### Wan 2.2 모델 통합
```python
# 모델 구조
models/
├── Wan2.1_VAE.pth          # VAE 모델
├── high_noise_model/        # 고노이즈 디퓨전 모델
│   └── *.safetensors       # 6개 파트
├── low_noise_model/         # 저노이즈 디퓨전 모델
│   └── *.safetensors       # 6개 파트
└── google/umt5-xxl/         # 텍스트 인코더
```

### AI 처리 파이프라인
1. **입력 처리**: 텍스트/이미지 전처리
2. **인코딩**: T5 텍스트 인코더 또는 VAE 이미지 인코더
3. **디퓨전**: 노이즈 예측 및 제거
4. **디코딩**: VAE 디코더로 비디오 생성
5. **후처리**: 프레임 보간, 업스케일링

---

## 사용자 인터페이스

### 레이아웃 구조
```
┌──────────┬─────────────────────────┬──────────┐
│  Asset   │      Main Workspace      │Properties│
│ Browser  │   (Node/Timeline/Hybrid) │  Panel   │
│          │                          │          │
│  280px   │        Flexible          │  320px   │
│          │                          │          │
│          ├─────────────────────────┤          │
│          │    Preview Panel         │          │
│          │      (240px)            │          │
└──────────┴─────────────────────────┴──────────┘
```

### 테마 시스템
- **Primary Color**: #00e5ff (Cyan)
- **Secondary Color**: #ff4081 (Pink)
- **Background**: #0a0a0a (Near Black)
- **Paper**: #1a1a1a (Dark Grey)
- **Typography**: Inter/Roboto 폰트

### 인터랙션 패턴
- **드래그 앤 드롭**: 노드, 파일, 에셋
- **컨텍스트 메뉴**: 우클릭 액션
- **키보드 단축키**: 
  - Ctrl+N: 새 프로젝트
  - Ctrl+S: 저장
  - Space: 재생/정지
  - Tab: 노드 추가

---

## 데이터 흐름

### 프로젝트 데이터 구조
```typescript
interface Project {
  id: string;
  name: string;
  created: Date;
  modified: Date;
  settings: {
    resolution: string;
    fps: number;
    duration: number;
  };
  nodes: Node[];
  edges: Edge[];
  timeline: TimelineData;
  assets: Asset[];
}
```

### Redux Store 구조
```typescript
interface RootState {
  project: ProjectState;
  nodeGraph: NodeGraphState;
  timeline: TimelineState;
  ui: UIState;
  generation: GenerationState;
  media: MediaState;
}
```

### 실시간 업데이트 플로우
1. **사용자 액션** → Redux Action Dispatch
2. **Reducer 처리** → State 업데이트
3. **Component Re-render** → UI 업데이트
4. **Side Effects** → Socket.io 이벤트 전송
5. **서버 처리** → AI 모델 실행
6. **결과 반환** → UI 업데이트

---

## 보안 및 성능

### 보안 조치
- **Context Isolation**: Renderer와 Main 프로세스 격리
- **Preload Script**: 안전한 API만 노출
- **CSP Headers**: Content Security Policy 적용
- **WebSecurity**: Production 빌드에서 활성화

### 성능 최적화
- **GPU 가속**:
  - `enable-gpu-rasterization`
  - `enable-zero-copy`
  - `ignore-gpu-blocklist`
- **메모리 관리**:
  - 대용량 파일 스트리밍
  - 비디오 프레임 캐싱
  - 노드 그래프 최적화
- **렌더링 최적화**:
  - React.memo 사용
  - Virtual DOM 최적화
  - 레이지 로딩

### 빌드 구성
- **Development**: Hot Reload, Source Maps, DevTools
- **Production**: 코드 압축, Tree Shaking, 최적화

---

## 배포 및 패키징

### 플랫폼별 빌드
- **Windows**: NSIS 인스톨러 (.exe)
- **macOS**: DMG 패키지 (.dmg)
- **Linux**: AppImage, DEB 패키지

### 자동 업데이트
- **electron-updater**: 자동 업데이트 시스템
- **Code Signing**: 디지털 서명 (Production)

---

## 결론

Artifex.AI는 최신 웹 기술과 AI를 결합한 혁신적인 비디오 제작 도구입니다. 노드 기반 워크플로우와 타임라인 편집을 통합하여 전문가와 초보자 모두가 사용할 수 있는 강력한 플랫폼을 제공합니다.

### 핵심 강점
1. **듀얼 워크플로우**: 유연한 작업 방식
2. **AI 통합**: 최첨단 생성 모델
3. **전문가 도구**: 산업 표준 기능
4. **확장성**: 플러그인 시스템
5. **성능**: GPU 가속 및 최적화

### 향후 계획
- 더 많은 AI 모델 통합
- 클라우드 렌더링 지원
- 협업 기능 강화
- 플러그인 마켓플레이스
- 모바일 컴패니언 앱

---

*본 문서는 Artifex.AI v2.0.0 기준으로 작성되었습니다.*
*최종 업데이트: 2025년 1월*