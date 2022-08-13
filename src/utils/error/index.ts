/**
 * 包装文案key的prefix
 * @param prefix 
 * @returns 
 */
export function tagWithPrefix(prefix: string) {
  return function _tag(key: string, message: string) {
    return tag(prefix + key, message);
  };
}

/**
 * 描述Error
 * @param key 文案key
 * @param message 用于调试的文本
 * @returns
 */
export function tag(key: string, message: string) {
  return function decorator(err: any) {
    err.message = message;
    err.key = key;
  };
}

export abstract class TtransError extends Error {
  declare key: string;
  toString() {
    return this.key ?? "error.unknown";
  }
}
