"use client";

import { useEffect, useRef } from "react";

export function RingField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, timer = 0, pointerX = 0, pointerY = 0, last = 0;
    let onResize = () => {};
    let onMove: (event: PointerEvent) => void = () => {};
    const start = () => {
      const node = canvas.current;
      const gl = node?.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
      if (!node || !gl) return;
      const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
      const vs = compile(gl.VERTEX_SHADER, "attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}");
      const fs = compile(gl.FRAGMENT_SHADER, "precision mediump float; uniform vec2 r; uniform float t; uniform vec2 m; void main(){vec2 uv=(gl_FragCoord.xy-.5*r)/r.y; vec2 c=vec2(-.08,.08); vec2 c2=vec2(.12*sin(t*.025),.12*cos(t*.025))+m*.035; float d=length(uv-c); float e=length(uv-c2); float a=sin(d*125.-t*.08); float b=sin(e*119.+t*.06); float v=.24+.2*(a+b)*.5; v=smoothstep(.08,.62,v); gl_FragColor=vec4(vec3(v),1.);}");
      const program = gl.createProgram()!; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program); gl.useProgram(program);
      const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const resolution = gl.getUniformLocation(program, "r"), time = gl.getUniformLocation(program, "t"), mouse = gl.getUniformLocation(program, "m");
      onResize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 1.5); node.width = Math.floor(node.clientWidth * dpr); node.height = Math.floor(node.clientHeight * dpr); gl.viewport(0, 0, node.width, node.height); gl.uniform2f(resolution, node.width, node.height); };
      onMove = (event: PointerEvent) => { pointerX = event.clientX / window.innerWidth - .5; pointerY = event.clientY / window.innerHeight - .5; };
      const draw = (now: number) => { if (document.hidden) { frame = requestAnimationFrame(draw); return; } if (now - last > 16) { gl.uniform1f(time, now / 1000); gl.uniform2f(mouse, pointerX, pointerY); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); last = now; } frame = requestAnimationFrame(draw); };
      onResize(); window.addEventListener("resize", onResize); window.addEventListener("pointermove", onMove, { passive: true }); frame = requestAnimationFrame(draw);
    };
    timer = window.setTimeout(start, 700);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); window.removeEventListener("pointermove", onMove); };
  }, []);
  return <><div className="rings-static" aria-hidden="true"/><canvas ref={canvas} className="ring-canvas" aria-hidden="true"/></>;
}
