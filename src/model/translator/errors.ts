import { tagWithPrefix, TtransError } from "@/utils/error";

const tag = tagWithPrefix("translator.error.");

@tag("default", "翻译模块默认错误")
export class TranslatorError extends TtransError {}

@tag("disabled", "翻译模块被停用")
export class TranslatorDisabledError extends TranslatorError {}

@tag("remote_error", "远端错误")
export class TranslatorRemoteError extends TranslatorError {}
