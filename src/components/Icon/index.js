import { createIconSet } from 'react-native-vector-icons';
import iconfontConfig from './iconfont.json';

function createIconSetFromIconfont(config, fontFamilyArg, fontFile) {
  const glyphMap = {};
  config.glyphs.forEach(glyph => {
    glyphMap[glyph.font_class] = glyph.unicode_decimal;
  });
  const fontFamily = fontFamilyArg || config.font_family || 'iconfont';

  return createIconSet(glyphMap, fontFamily, fontFile || `${fontFamily}.ttf`);
}

export default createIconSetFromIconfont(iconfontConfig);
