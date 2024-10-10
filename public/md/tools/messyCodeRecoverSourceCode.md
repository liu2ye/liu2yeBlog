```java
@Slf4j
public class MessyCodeRecover {
    // 常用字符集
    private static final String[] hotCharsetArray = new String[]{
            "UTF-8", "GBK", "GB2312", "Big5", "ISO-8859-1", "windows-1250", "Shift_JIS", "UTF-16", "UTF-32"
    };

    // 全部字符集
    private static final Map<String, Charset> charsetMap = Charset.availableCharsets();

    // 结果中包含这些字符的，不再显示 需要filterCharOpen = true
    private static final CharSequence[] filterChar = new CharSequence[]{
            "?", "�"
    };
    private static final boolean filterCharOpen = true; // 结果过滤是否开启

    // 对于这些字符集过滤，不再考虑, %代表模糊匹配 例: %IBM 匹配以IBM结尾的，IBM%匹配以IBM开头的, %IBM%匹配包含IBM的
    private static final String[] filterCharset = new String[]{
            "%IBM%", "x-%", "X-%"
    };
    private static final char LIKE_CHAR = '%';
    private static final Map<String, FilterCharsetType> filterCharsetMap = new HashMap<>();
    static {
        // 解析过滤的字符集
        for (String charsetStr : filterCharset) {
            if (!StrUtil.contains(charsetStr, LIKE_CHAR)){
                filterCharsetMap.put(charsetStr, FilterCharsetType.PRECISE);
                continue;
            }
            if (StrUtil.startWith(charsetStr, LIKE_CHAR)) {
                if (StrUtil.endWith(charsetStr, LIKE_CHAR)) {
                    filterCharsetMap.put(charsetStr.substring(1, charsetStr.length() - 1), FilterCharsetType.ALL);
                } else {
                    filterCharsetMap.put(charsetStr.substring(1), FilterCharsetType.LEFT);
                }
            } else {
                filterCharsetMap.put(charsetStr.substring(0, charsetStr.length() - 1), FilterCharsetType.RIGHT);
            }
        }

    }

    enum FilterCharsetType {
        PRECISE, //精确匹配, 不模糊
        LEFT,
        RIGHT,
        ALL;
    }


//    public static void main(String[] args) {
////        messyCodeRecover("ÂåÀöËþ´´î½Ì³Ì");
//        messyCodeRecover("鑻遍泟鑱旂洘");
//
////        messyCodeRecoverAllCharset("鑻遍泟鑱旂洘");
//    }

    public static List<MessyCodeRecoverResultVo> messyCodeRecover(String messyCode) {
        ArrayList<Charset> charsets = new ArrayList<>();

        for (String charsetName : hotCharsetArray) {
            Charset charset = Charset.forName(charsetName);
            charsets.add(charset);

        }
        return messyCodeRecover(messyCode, charsets);
    }

    public static List<MessyCodeRecoverResultVo> messyCodeRecoverAllCharset(String messyCode) {
        ArrayList<Charset> charsets = new ArrayList<>();


        for (String charsetName : charsetMap.keySet()) {
            charsets.add(charsetMap.get(charsetName));
        }

        return messyCodeRecover(messyCode, charsets);
    }

    private static List<MessyCodeRecoverResultVo> messyCodeRecover(String messyCode, ArrayList<Charset> charsets) {
        List<MessyCodeRecoverResultVo> list = new ArrayList<>();

        for (Charset curCharset : charsets) {
            for (Charset targetCharset : charsets) {
                if (charsetFilter(curCharset, targetCharset)) {
                    try {
                        MessyCodeRecoverResultVo recover = recover(messyCode, curCharset, targetCharset, filterCharOpen);
                        if(recover != null){
                            list.add(recover);
                        }
                    } catch (UnsupportedOperationException e) {
                        String errorMsg = StrUtil.format("不支持的编码: {}--->{}", curCharset, targetCharset);
                        log.debug(errorMsg);
                    }
                }
            }
        }

        return list;
    }

    private static boolean charsetFilter(Charset curCharset, Charset targetCharset) {
        if (curCharset.equals(targetCharset)) {
            return false;
        }

        return charsetFilter(curCharset.name()) && charsetFilter(targetCharset.name());
    }

    private static boolean charsetFilter(String charsetName) {
        for (String s : filterCharsetMap.keySet()) {
            if (StrUtil.contains(charsetName, s)){
                FilterCharsetType filterCharsetType = filterCharsetMap.get(s);

                switch (filterCharsetType){
                    case PRECISE: if (charsetName.equals(s)) return false;
                    case ALL: return false;
                    case LEFT: if (StrUtil.endWith(charsetName, s)) return false;
                    case RIGHT: if (StrUtil.startWith(charsetName, s)) return false;
                }
            }
        }
        return true;
    }

    private static MessyCodeRecoverResultVo recover(String messyCode, Charset curCharset, Charset targetCharset, boolean filter) {
        String targetStr = new String(messyCode.getBytes(curCharset), targetCharset);

        if (filter && StrUtil.containsAny(targetStr, filterChar)) {
            return null;
        }

        String result = StrUtil.format("乱码字符集: {}, \t源码字符集: {}, 结果: ======================={}", curCharset.name(), targetCharset.name(), targetStr);
        log.info(result);

        return new MessyCodeRecoverResultVo(curCharset.name(), targetCharset.name(), targetStr);
    }
}
```
