import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Home = () => {
  return (
    <Box mx={2} my={1}>
      <h1>介绍</h1>
      <section>三大功能：虚拟屏幕，OCR图像转文字，机器翻译</section>
      <h2>虚拟屏幕</h2>
      <section>
        视频源可以是本机的其他软件窗口，可以是采集卡采集到的Nintendo
        Switch等游戏主机的画面，也可以是摄像头。虚拟屏幕同时可以采集音频输入，并且在网页中实时播放音频。
      </section>
      <section>
        在不方便使用屏幕或屏幕没有音频输出时，可以将电脑或者手机作为应急屏幕。虚拟屏幕功能完全免费，虚拟屏幕的所有组件均可以离线运行，t
        trans绝对不会上传您的画面。
      </section>
      <h2>OCR图像转文字</h2>
      <section>
        在视频源中出现的文字可以通过OCR功能转换成文本，目前支持中文，英文，日文3种语言，更多语言正在完善种。
      </section>
      <section>
        OCR功能完全免费，OCR的所有组件均可以离线运行，但为了提高ocr质量，t trans会随机上传您的OCR图像用于优化OCR模型。
      </section>
      <h2>机器翻译</h2>
      <section>
        ocr提取完毕文本后，将会自动进行机器翻译，目前支持中文，英文，日文3种语言互译。
      </section>
      <section>
        机器翻译功能不是免费功能，需要在设置中填写密钥才可以使用该功能。翻译功能需要上传源语言文本到服务器。
        当然，翻译服务器完全开源，您可以自己编译运行翻译器，并且在高级模式中设置自定义翻译服务器。
      </section>
      <section>
        测试阶段提供一个每天20万字符的测试key：(Free-Translate)
      </section>
      <h2>
        更多介绍 请点击<Link href="/#/about">关于</Link>
      </h2>
    </Box>
  );
};

export default Home;
