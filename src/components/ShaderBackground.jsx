import { useEffect, useRef } from 'react'

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }'
const FRAG = `
precision highp float;
uniform vec2 r; uniform float t;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y);
}
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*n(p); p*=2.; a*=.5; } return v; }
void main(){
  vec2 p = (gl_FragCoord.xy - .5*r)/r.y;
  float time = t*.10;
  vec2 q = vec2(fbm(p*1.4+time), fbm(p*1.4+vec2(5.2,1.3)-time));
  float f = fbm(p*1.4 + 2.*q + time);
  vec3 c1 = vec3(.015,.03,.11);
  vec3 c2 = vec3(.06,.20,.62);
  vec3 c3 = vec3(.30,.58,1.0);
  vec3 col = mix(c1, c2, smoothstep(.2,.8,f));
  col = mix(col, c3, smoothstep(.6,1.,f*q.x*1.5)*.4);
  col *= .45 + .55*smoothstep(1.4,.0,length(p));
  gl_FragColor = vec4(col,1.);
}`

export default function ShaderBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl')
    if (!gl) return
    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uR = gl.getUniformLocation(prog, 'r')
    const uT = gl.getUniformLocation(prog, 't')
    const scale = 0.5
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = Math.max(1, window.innerWidth * scale)
      canvas.height = Math.max(1, window.innerHeight * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf
    const start = performance.now()
    const draw = () => {
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.uniform1f(uT, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="shader-bg" aria-hidden="true" />
}
