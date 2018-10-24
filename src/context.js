import { mat3 } from 'gl-matrix'
import OpenSans from './assets/OpenSans-Regular.png'
import ftexturepng from './assets/f-texture.png'
import { createTextureProgramInfo, createTextureVaoInfo } from './shaders/texture'
import { createSdfTextureProgramInfo, createSdfTextureVaoInfo } from './shaders/sdf-texture'
import { createComplexPolygonVaoData, createPolylineVaoData, createGlyphsVaoData } from './vao-data'
import { createPolygonProgramInfo, createPolygonVaoInfo } from './shaders/polygon.js'
import { texturePolygonFlat2d } from './geometry.js'
import { CURVE } from './line-data.js'
import { createPolylineVaoInfo, createPolylineProgramInfo } from './shaders/polyline.js'
import { createAnchorsAndNormals } from './math-util.js'

export const unitSizePx = 512
export const projection = (unitSizePx, width, height) => [ unitSizePx / width * 2, 0, 0, 0, -1 * unitSizePx / height * 2, 0, -1, 1, 1 ]

export const createContext = (gl) => {
  const polygonProgramInfo = createPolygonProgramInfo(gl)
  const polylineProgramInfo = createPolylineProgramInfo(gl)
  const sdfTextureProgramInfo = createSdfTextureProgramInfo(gl)
  const textureProgramInfo = createTextureProgramInfo(gl)
  const fontAtlasTexture = createAtlasTexture(gl, sdfTextureProgramInfo)
  const fTexture = createFTexture(gl)

  const textureVaoData = createComplexPolygonVaoData([ { t: [ 0, 0 ], r: 0, s: [ 0.025, 0.025 ] } ])
  const textureVaoInfo = createTextureVaoInfo(gl, textureProgramInfo, textureVaoData)

  const polygonVaoInfo = createPolygonVaoInfo(gl, polygonProgramInfo, { vertexElements: texturePolygonFlat2d })

  // const text = 'A!B!C!' // 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUu'
  // const size = 0.1
  // const textVaoData = createTextVaoData(text, size)
  // const textVaoInfo = createSdfTextureVaoInfo(gl, sdfTextureProgramInfo, textVaoData)

  const fontSize = 24 / unitSizePx
  const gapSize = 3 * fontSize
  const text = 'This is a very long line test, blah blah blah!'

  const { anchors, normals } = createAnchorsAndNormals(CURVE, text, fontSize, gapSize)

  const singleGlyphVaoData = createGlyphsVaoData(text, anchors, normals)
  const singleGlyphVaoInfo = createSdfTextureVaoInfo(gl, sdfTextureProgramInfo, singleGlyphVaoData)

  const polylineVaoData = createPolylineVaoData(CURVE)
  const polylineVaoInfo = createPolylineVaoInfo(gl, polylineProgramInfo, polylineVaoData)

  const width = gl.canvas.clientWidth
  const height = gl.canvas.clientHeight
  const widthUn = width / unitSizePx
  const heightUn = height / unitSizePx
  let projMatrix = projection(unitSizePx, width, height)
  mat3.translate(projMatrix, projMatrix, [ (widthUn - 1) / 2, (heightUn - 1) / 2 ])

  return {
    projMatrix,
    polygonProgramInfo,
    sdfTextureProgramInfo,
    textureProgramInfo,
    polylineProgramInfo,
    polygonVaoInfo,
    textureVaoInfo,
    singleGlyphVaoInfo,
    polylineVaoInfo,
    fontAtlasTexture,
    fTexture
  }
}

const isPowerOf2 = (value) => value & (value - 1 == 0)

export const createAtlasTexture = (gl) => {
  const texture = gl.createTexture()
  loadCanvas(OpenSans, (img) => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  })

  return texture
}

export const createFTexture = (gl) => {
  const texture = gl.createTexture()
  loadCanvas(ftexturepng, (img) => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  })

  return texture
}

const loadCanvas = (url, done) => {
  var img = new Image()
  img.onload = function () {
    done(img)
  }

  img.src = url
}
