import { Box, Link } from "@mui/material";

const About = () => {
  return (
    <Box mx={2} my={1}>
      <h1>使用说明</h1>
      <h2>基本设置</h2>
      <p>基本设置需要设置翻译语言，识别语言，音视频设备。</p>
      <p>
        翻译语言设置：翻译引擎目前只有niutransapi可用，源语言和目标语言目前提供zh_CN中文简体，zh_TW中文繁体，ja日语，en英语四种语言。
      </p>
      <p>
        识别语言设置：在Ocr语言下拉框选择需要识别的语言类型，目前提供chi_sim中文简体，chi_tra中文繁体，jpn日语，en英语四种语言。
      </p>
      <p>
        音视频设备设置：通过勾选“当前视频源”选择框可以切换当前电脑屏幕视频或者外接视频输入设备。在采集卡模式下，需要在视频输入设备选择下拉框选中需要识别的视频源，大多数情况下采集卡带有“USB
        VIDEO”字样，音频输入设备同理。
      </p>
      <h2>高级设置</h2>
      <p>
        高级模式下可以设置自定义服务器，自定义服务器接口需要兼容
        <Link href="https://github.com/Tim-Zhong-2000/TranslateMS">
          翻译后端仓库
        </Link>
        。
      </p>
      <p>
        允许手动调整图像预处理参数，达到更好的OCR效果，在翻译器页面也会展示参数调整面板。
      </p>
      <p>
        <strong>目前没有开发出自适应预处理算法，暂时采用人工调整的方法</strong>{" "}
        正常情况下（指没有打开反色），
        <strong>跟着以下几点可以得到一个比较好的预处理效果</strong>。
        <ol>
          <li>背景大部分为黑色，文字难以辨认，需要适当调低二值化阈值。</li>
          <li>全部为白色，没有黑色的文字，需要适当调高二值化阈值</li>
          <li>
            文字笔画太粗导致重叠，需要调高erode迭代次数，同时提高dilate迭代次数，实现开操作。也可以同时适当降低二值化阈值，有可能有更好的效果。
          </li>
        </ol>
        总之，预处理的目的是尽可能
        <strong>让背景变成白色，让文字变成黑色而且笔画尽可能细</strong>
        ，这样可以让OCR速度更快，效果更好。
      </p>
      <h1>本项目开源，欢迎技术交流</h1>
      <p>目前属于毛坯房状态，更好看的UI和视频上手教程正在准备过程中。</p>
      <p>
        <Link href="https://github.com/Tim-Zhong-2000/Translator-fe">
          前端仓库
        </Link>
      </p>
      <p>
        <Link href="https://github.com/Tim-Zhong-2000/TranslateMS">
          后端仓库
        </Link>
      </p>
    </Box>
  );
};
export default About;
