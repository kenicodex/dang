import { colors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'
import { radii } from './radii'
import { shadows } from './shadows'

export interface DangDesignTokens {
  colors: typeof colors.light
  typography: typeof typography
  spacing: typeof spacing
  radii: typeof radii
  shadows: typeof shadows
}

export function getTokens(scheme: 'light' | 'dark' = 'light'): DangDesignTokens {
  return {
    colors: colors[scheme],
    typography,
    spacing,
    radii,
    shadows,
  }
}

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
}
