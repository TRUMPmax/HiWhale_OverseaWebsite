"use client";

import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Placeholder } from "@/components/ui/Placeholder";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/** GLB 加载失败时回退占位块（文件未投放/格式错误） */
class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type ModelViewerProps = {
  url: string;
  /** 改变该值可重置视角 */
  resetKey: number;
  placeholder: { label: string; size?: string; name: string };
};

/** GLB 3D 查看器：拖拽旋转 / 滚轮缩放（仅在 Canvas 区域）/ 双击无操作 */
export function ModelViewer({ url, resetKey, placeholder }: ModelViewerProps) {
  const fallback = (
    <Placeholder
      ratio="aspect-square"
      label={placeholder.label}
      size={placeholder.size}
      name={placeholder.name}
    />
  );
  return (
    <ModelErrorBoundary key={url} fallback={fallback}>
      <Canvas
        key={resetKey}
        camera={{ position: [3.2, 2.2, 3.2], fov: 42 }}
        className="aspect-square w-full rounded-xl border border-slate-200 bg-slate-50"
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stage intensity={0.6} environment="city" adjustCamera={false} shadows={false}>
            <Model url={url} />
          </Stage>
          <ContactShadows position={[0, -0.01, 0]} opacity={0.35} blur={2.5} scale={10} />
        </Suspense>
        <OrbitControls makeDefault enablePan={false} minDistance={1.2} maxDistance={12} />
      </Canvas>
    </ModelErrorBoundary>
  );
}

// 预加载默认模型
useGLTF.preload("/images/home/model-agv-mbv15r.glb");
