export interface ScssVariables {
  [x: string]: unknown;
  // 黑色主题
  menuDarkBg: string;
  menuDarkHover: string;
  menuDarkText: string;
  menuDarkActiveText: string;
  menuLogoDark: string;
  subMenuDarkBg: string;
  subMenuDarkHover: string;
  subMenuDarkActiveText: string;
  elIconDark: string;
  svgIconDark: string;
  // 白色主题
  menuLightBg: string;
  menuLightHover: string;
  menuLightText: string;
  menuLightActiveText: string;
  menuLogoLight: string;
  subMenuLightBg: string;
  subMenuLightHover: string;
  subMenuLightActiveText: string;
  elIconLight: string;
  svgIconLight: string;
}

export const variables: ScssVariables;

export default variables;
