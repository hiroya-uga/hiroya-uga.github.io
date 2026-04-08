import { convertHexToRgb, convertHslToHex, convertRgbToHsl } from '@/utils/color';

const MIN_LIGHTNESS = 0;
const MAX_LIGHTNESS = 1;
const BLACK_LUMINANCE = 0;
const WHITE_LUMINANCE = 1;

/** Binary search の反復回数。精度と計算量のバランスを取るための上限。 */
const SEARCH_ITERATION_COUNT = 20;

/** RGB 各チャンネルの最大値。0-255 の整数値を 0-1 に正規化するために使う。 */
const MAX_RGB_CHANNEL_VALUE = 255;

/** sRGB の低輝度側と高輝度側を切り替えるしきい値。 */
const SRGB_LINEAR_THRESHOLD = 0.04045;

/** sRGB の低輝度側に使う線形式の除数。 */
const SRGB_LOW_INTENSITY_DIVISOR = 12.92;

/** sRGB のガンマ補正式で加算する補正値。 */
const SRGB_GAMMA_OFFSET = 0.055;

/** sRGB のガンマ補正式で除算に使うスケール値。 */
const SRGB_GAMMA_SCALE = 1.055;

/** sRGB のガンマ補正式に使う指数。 */
const SRGB_GAMMA_EXPONENT = 2.4;

/** 相対輝度計算における赤チャンネルの重み。 */
const RED_LUMINANCE_WEIGHT = 0.2126;

/** 相対輝度計算における緑チャンネルの重み。 */
const GREEN_LUMINANCE_WEIGHT = 0.7152;

/** 相対輝度計算における青チャンネルの重み。 */
const BLUE_LUMINANCE_WEIGHT = 0.0722;

/** WCAG のコントラスト比計算で使うオフセット。 */
const WCAG_CONTRAST_RATIO_OFFSET = 0.05;

interface ContrastRatioForLightnessParams {
  hue: number;
  saturation: number;
  lightness: number;
  otherLuminance: number;
}

interface ConvertLightnessToHexColorParams {
  hue: number;
  saturation: number;
  lightness: number;
}

interface SearchAccessibleLightnessParams {
  hue: number;
  saturation: number;
  startLightness: number;
  boundaryLightness: number;
  otherLuminance: number;
  targetRatio: number;
}

interface FindAccessibleColorParams {
  hexColor: string;
  otherHex: string;
  targetRatio: number;
}

/** sRGB を相対輝度計算用の線形値に変換する。 */
const linearize = (channel: number) => {
  const normalizedChannel = channel / MAX_RGB_CHANNEL_VALUE;
  return normalizedChannel <= SRGB_LINEAR_THRESHOLD
    ? normalizedChannel / SRGB_LOW_INTENSITY_DIVISOR
    : ((normalizedChannel + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_SCALE) ** SRGB_GAMMA_EXPONENT;
};

/** WCAG の相対輝度係数。人の視覚に合わせて緑の寄与が最も大きい。 */
export const getLuminance = ([red, green, blue]: [number, number, number]) =>
  RED_LUMINANCE_WEIGHT * linearize(red) +
  GREEN_LUMINANCE_WEIGHT * linearize(green) +
  BLUE_LUMINANCE_WEIGHT * linearize(blue);

export const calcContrastRatio = (firstLuminance: number, secondLuminance: number) => {
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + WCAG_CONTRAST_RATIO_OFFSET) / (darker + WCAG_CONTRAST_RATIO_OFFSET);
};

const calcContrastRatioForLightness = ({
  hue,
  saturation,
  lightness,
  otherLuminance,
}: ContrastRatioForLightnessParams) => {
  const candidateHexColor = convertHslToHex([hue, saturation, lightness]);
  const candidateRgbColor = convertHexToRgb(candidateHexColor);
  const candidateLuminance = getLuminance(candidateRgbColor);

  return calcContrastRatio(candidateLuminance, otherLuminance);
};

/**
 * Binary search for the HSL lightness value closest to startLightness
 * (towards boundaryLightness=0 or 1) that achieves targetRatio.
 * Returns null if not achievable even at the extreme.
 */
const searchAccessibleLightness = ({
  hue,
  saturation,
  startLightness,
  boundaryLightness,
  otherLuminance,
  targetRatio,
}: SearchAccessibleLightnessParams) => {
  const movingTowardDarker = boundaryLightness < startLightness;
  const boundaryLuminance = movingTowardDarker ? BLACK_LUMINANCE : WHITE_LUMINANCE;
  if (calcContrastRatio(boundaryLuminance, otherLuminance) < targetRatio) {
    return null;
  }

  let lowerLightness = Math.min(startLightness, boundaryLightness);
  let upperLightness = Math.max(startLightness, boundaryLightness);

  for (let iterationIndex = 0; iterationIndex < SEARCH_ITERATION_COUNT; iterationIndex++) {
    const middleLightness = (lowerLightness + upperLightness) / 2;
    const middleContrastRatio = calcContrastRatioForLightness({
      hue,
      saturation,
      lightness: middleLightness,
      otherLuminance,
    });
    const reachesTargetRatio = targetRatio <= middleContrastRatio;
    const shouldUpdateLowerLightness = movingTowardDarker === reachesTargetRatio;

    if (shouldUpdateLowerLightness) {
      lowerLightness = middleLightness;
    } else {
      upperLightness = middleLightness;
    }
  }

  return movingTowardDarker ? lowerLightness : upperLightness;
};

/** hexColor の明度だけを調整し、otherHex と targetRatio を満たす最も近い色を返す。 */
export const findAccessibleColor = ({ hexColor, otherHex, targetRatio }: FindAccessibleColorParams) => {
  const otherRgbColor = convertHexToRgb(otherHex);
  const sourceRgbColor = convertHexToRgb(hexColor);

  const otherLuminance = getLuminance(otherRgbColor);
  const sourceLuminance = getLuminance(sourceRgbColor);

  if (targetRatio <= calcContrastRatio(sourceLuminance, otherLuminance)) {
    return hexColor;
  }

  const [hue, saturation, sourceLightness] = convertRgbToHsl(sourceRgbColor);
  const darkerLightness = searchAccessibleLightness({
    hue,
    saturation,
    startLightness: sourceLightness,
    boundaryLightness: MIN_LIGHTNESS,
    otherLuminance,
    targetRatio,
  });
  const lighterLightness = searchAccessibleLightness({
    hue,
    saturation,
    startLightness: sourceLightness,
    boundaryLightness: MAX_LIGHTNESS,
    otherLuminance,
    targetRatio,
  });

  const availableLightness = darkerLightness ?? lighterLightness;

  if (availableLightness == null) {
    return null;
  }

  if (darkerLightness == null || lighterLightness == null) {
    return convertHslToHex([hue, saturation, availableLightness]);
  }

  const darkerLightnessDistance = Math.abs(darkerLightness - sourceLightness);
  const lighterLightnessDistance = Math.abs(lighterLightness - sourceLightness);
  const nearestLightness = darkerLightnessDistance <= lighterLightnessDistance ? darkerLightness : lighterLightness;

  return convertHslToHex([hue, saturation, nearestLightness]);
};
