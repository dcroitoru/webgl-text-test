import { mat3 } from 'gl-matrix'
import { createPolygonProgramInfo } from './programs'
import { createPolygonVaoInfo } from './vao'

export const createContext = (gl) => {
  const polygonProgramInfo = createPolygonProgramInfo(gl)
  const polygonVaoInfo = createPolygonVaoInfo(
    gl,
    {
      vertices: [ -1, -1, 1, -1, 1, 1, -1, 1 ],
      indices: [ 0, 1, 2, 2, 3, 0 ]
    },
    polygonProgramInfo
  )

  const projMatrix = mat3.create()

  return { polygonProgramInfo, polygonVaoInfo, projMatrix }
}
