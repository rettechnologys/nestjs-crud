export function safeRequire<T = any>(path: string, loader?: () => T): T | null {
  try {
    /* istanbul ignore next */
    const pack = loader ? loader() : require(path);
    return pack;
  } catch (_) {
    /* istanbul ignore next */
    return null;
  }
}

/* retts was here */
export function updateUrlParameter(url, param, value): string {
  var regex = new RegExp('(' + param + '=)[^&]+');
  return url.replace(regex, '$1' + value);
}
